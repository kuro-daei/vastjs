/**
 * Vast manager
 * @author Eiji Kuroda
 * @license MIT
 */

/** ****************************************************************************
 Vast XML
*******************************************************************************/
class VastXML {

  /** **************************************************************************
   * @param {XML} vast vast xml
   ****************************************************************************/
  constructor(vast) {
    if (typeof vast === 'undefined') {
      throw new Error('vast format error');
    }
    this.vast = vast;
  }

  /** **************************************************************************
   * Check the vast is wrapper or not.
   * @return {Boolean} true:vast is wrapper, false:not
   ****************************************************************************/
  isWrapper() {
    return !!this.vast.querySelector('VAST Ad Wrapper');
  }

  /** **************************************************************************
   * Get the wrapper url.
   * @return {String} wrapped vast url
   ****************************************************************************/
  wrapperUrl() {
    return VastXML.text(this.vast.querySelector('VAST Ad Wrapper VASTAdTagURI'));
  }

  /** **************************************************************************
   * get media file url
   * @param  {String} type 'video/mp4' or 'video/webm' or etc.
   * @return {String} video media url
   ****************************************************************************/
  media(type) {
    return VastXML.text(this.vast.querySelector(`Vast Ad Creatives Creative Linear MediaFiles MediaFile[media="${type}"]`));
  }

  /** **************************************************************************
   * get companion ad
   * @param  {Number} width companion width
   * @param  {Number} height companion height
   * @return {Object} companion information
   ****************************************************************************/
  companion(width = 0, height = 0) {
    const elm = this.vast.querySelector(`Vast Ad Creative Linear Creatives CompanionAds Companion[width="${width}"][height="${height}"]`);
    if (!elm) {
      return null;
    }
    const res = {};
    res.img = VastXML.text(elm.querySelector('StaticResource'));
    res.iframe = VastXML.text(elm.querySelector('IFrameResource'));
    res.html = VastXML.text(elm.querySelector('HTMLResource'));
    res.click = VastXML.text(elm.querySelector('CompanionClickThrough'));
    res.tracking = VastXML.text(elm.querySelector('CompanionClickTracking'));
    return res;
  }
  /** **************************************************************************
   * Get the tracking events.
   * @return {Array} tracking events
   ****************************************************************************/
  trackingEvents() {
    const events = [];
    this.vast.querySelectorAll('VAST Ad Creatives Creative Linear TrackingEvents Tracking').forEach((track) => {
      const event = track;
      event.prototype.name = () => event.getAttribute('event');
      event.prototype.url = () => VastXML.text(event);
      event.prototype.offest = () => VastXML.sec(event.getAttribute('offset'));
      events.push(event);
    });
    return events;
  }

  /** **************************************************************************
  * convert element to string.
   * @param  {Element} elm xml element
   * @return {String} trimed text content
   ****************************************************************************/
  static text(elm) {
    if (elm === false || typeof elm === 'undefined') {
      return null;
    }
    return elm.textContent.trim();
  }

  /** **************************************************************************
   * convert string to sec.
   * @param  {String} hms like '12:34:56'
   * @return {Number} sec
   ****************************************************************************/
  static sec(hms) {
    const s = hms.split(':');
    return (parseInt(s[0], 10) * 3600) + (parseInt(s[1], 10) * 60) + parseInt(s[2], 10);
  }

}

/** ****************************************************************************
 Vast Manager
*******************************************************************************/
class VastManager {

  /** **************************************************************************
   * @param {HTMLElement} target target HTML element
   * @param {Boolean} debug true:debug, false:no debug mode (default)
   ****************************************************************************/
  constructor(target) {
    this.duration = 0;
    this.tracked = [];
    this.tracking = true;
    this.tracks = {};
    this.tracks.impressions = [];
    this.tracks.videoClicksTracking = [];
    this.tracks.videoClicksThrough = [];
    this.tracks.progresses = {};
    this.tracks.percents = {};
    this.tracks.percents[0] = [];
    this.tracks.percents[25] = [];
    this.tracks.percents[50] = [];
    this.tracks.percents[75] = [];
    this.tracks.percents[100] = [];
    this.target = target;
  }

  /** **************************************************************************
   * vast loader
   *
   * @param  {String} url vast url
   * @return {Promise}
   ****************************************************************************/
  load(url) {
    this.wrapperNest = 0;
    return new Promise((resolve, reject) => {
      this.getVast(url, resolve, reject);
    });
  }

  /** **************************************************************************
   * get vast xml
   *
   * @param  {String} url  url
   * @param  {Function} resolve resolve callback
   * @param  {Function} reject  reject callback
   * @return {void}
   ****************************************************************************/
  getVast(url, resolve, reject) {
    const u = url.replace('$rand$', Math.random(Date.now()));
    new Promise((ok, ng) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'document';
      xhr.withCredentials = true;
      xhr.addEventListener('load', () => { ok(xhr); }, false);
      xhr.addEventListener('error', (error) => { ng(error); }, false);
      xhr.open('GET', u, true);
      xhr.send();
    }).then((xhr) => {
      if (xhr.status !== 200) {
        reject(new Error(`invalid url :${u}`));
        return;
      }
      try {
        this.vast = new VastXML(xhr.response);
        this.addTrackingEvents();
        if (this.vast.isWrapper()) {
          if (this.wrapperNest >= 5) {
            throw new Error('The vast wrapper is deeper 5 level nest.');
          }
          this.wrapperNest += 1;
          this.getVast(this.vast.wrapperUrl, resolve, reject);
          return;
        }
      } catch (error) {
        reject(error);
      }
      resolve(this);
    }, (error) => {
      reject(error);
    });
  }

  /** **************************************************************************
   * add tracking event from vast
   * @return {void}
   ****************************************************************************/
  addTrackingEvents() {
    const t = this.tracks;
    Array.prototype.push.apply(t.impressions, this.vast.impressions);
    Array.prototype.push.apply(t.videoClicksTracking, this.vast.clickTrakings);
    Array.prototype.push.apply(t.videoClicksThrough, this.vast.clickThroughs);
    this.vast.trackingEvents().forEach((event) => {
      if (event.name === 'progress') {
        const offset = event.offset();
        t.progresses[offset] = t.progresses[offset] ? t.progresses[offset] : [];
        t.progresses[offset].push(event.url());
      } else if (event.name === 'start') {
        t.percents[0].push(event.url());
      } else if (name === 'firstQuartile') {
        t.percents[25].push(event.url());
      } else if (name === 'midpoint') {
        t.percents[50].push(event.url());
      } else if (name === 'thirdQuartile') {
        t.percents[75].push(event.url());
      } else if (name === 'complete') {
        t.percents[100].push(event.url());
      } else {
        t[name] = t[name] ? t[name] : [];
        t[name].push(event.url());
      }
    });
  }

  /** **************************************************************************
   * get media file url
   * @param  {String} type 'video/mp4' or 'video/webm' or etc.
   * @return {String} video media url
   ****************************************************************************/
  media(type = 'video/mp4') {
    return this.vast.media(type);
  }

  /** **************************************************************************
   * get companion ad
   * @param  {Number} width companion width
   * @param  {Number} height companion height
   * @return {Object} companion information
   ****************************************************************************/
  companion(width = 0, height = 0) {
    return this.vast.companion(width, height);
  }

  /** **************************************************************************
   * tracking on or off
   * @param  {Boolean} isTracking  true: tracking, false: not tracking
   * @return {void}
   ****************************************************************************/
  tracking(isTracking) {
    this.tracking = !!isTracking;
  }

  /** **************************************************************************
   * timeupdate
   * @param  {Float} current current time
   * @param  {Float} duration    video duration
   * @return {void}
   ****************************************************************************/
  timeupdate(current, duration) {
    if (!this.tracking) {
      return;
    }
    const trackSmaller = (org, target) => {
      const removes = Object.keys(org).filter(v => v <= target);
      const remains = org;
      removes.forEach(k => delete remains[k]);
      removes.forEach(trc => this.track(trc));
      return remains;
    };
    this.tracks.percents = trackSmaller(this.tracks.percents, (current / duration) * 100.0);
    this.tracks.progresses = trackSmaller(this.tracks.progresses, current);
  }

  /** **************************************************************************
   * fire vast event
   * @param  {String} url beacon url
   * @return {void}
   ****************************************************************************/
  track(url) {
    const img = document.createElement('img');
    return new Promise((resolve) => {
      img.addEventListener('load', () => {
        this.target.removeChild(img);
        this.target.dispatchEvent(new CustomEvent('vastEvent', {
          detail: { url }, bubbles: true,
        }));
        this.tracked.push(url);
        resolve();
      });
      img.src = url;
      img.style.cssText = 'position:absolute; top:1px; left:1px; width:1px; height:1px; opacity:0.1;';
      this.target.appendChild(img);
    });
  }

}

module.exports = VastManager;
