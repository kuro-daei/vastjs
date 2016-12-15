/**
 * Vast manager
 * @author Eiji Kuroda
 * @license MIT
 */

/** ****************************************************************************
 Vast XML
*******************************************************************************/
class Vast {

  /** **************************************************************************
   * @param {HTMLElement} target target HTML element
   ****************************************************************************/
  constructor(target) {
    this.duration = 0;
    this.tracks = {};
    this.tracked = {};
    this.tracks.impressions = [];
    this.tracks.progresses = [];
    this.tracks.percents = [];
    this.target = target;
    this.wrapperNest = 0;
  }

  /** **************************************************************************
   * vast loader
   * @param  {String} url vast url
   * @return {Promise}
   ****************************************************************************/
  load(url) {
    return new Promise((resolve, reject) => {
      this.myGetVast(url, resolve, reject);
    });
  }

  /** **************************************************************************
   * get media file url
   * @param {String} type 'video/mp4' or 'video/webm' or etc.
   * @param {Numer} bitrate kbps. pickup media file less than the bitrate.
   * @return {String} video media url
   ****************************************************************************/
  media(type = 'video/mp4', bitrate = 1500) {
    const root = this.vast.querySelector(`${this.base} Creatives Creative Linear MediaFiles`);
    let selectedBitrate = 0;
    let selected = null;
    root.querySelectorAll(`MediaFile[delivery="progressive"][type="${type}"]`).forEach((elm) => {
      const currBitrate = Number.parseInt(elm.getAttribute('bitrate'), 10);
      if (currBitrate > selectedBitrate && currBitrate <= bitrate) {
        selectedBitrate = currBitrate;
        selected = elm;
      }
    });
    if (selected === null) {
      return null;
    }
    return Vast.text(selected);
  }

  /** **************************************************************************
   * check the vast has companion.
   * @param  {Number} width companion width
   * @param  {Number} height companion height
   * @param  {Number} index index of list. default is 0.
   * @return {Boolean} true:has false:not
   ****************************************************************************/
  hasCompanion(width, height, index = 0) {
    const elm = this.myCompanion(width, height, index);
    return !!elm;
  }

  /** **************************************************************************
   * create companion html elements..
   * @param  {Number} width companion width
   * @param  {Number} height companion height
   * @param  {Number} index index of list. default is 0.
   * @return {Element} html element.
   ****************************************************************************/
  createCompanionElement(width, height, index = 0) {
    const comp = this.myCompanion(width, height, index);
    if (!comp) {
      return null;
    }
    let elm;
    if (comp.querySelector('StaticResource')) {
      const url = Vast.text(comp.querySelector('StaticResource'));
      elm = document.createElement('img');
      elm.src = url;
    } else if (comp.querySelector('IFrameResource')) {
      const url = Vast.text(comp.querySelector('IFrameResource'));
      elm = document.createElement('iframe');
      elm.src = url;
    } else if (comp.querySelector('HTMLResource')) {
      const code = Vast.text(comp.querySelector('HTMLResource'));
      elm = document.createElement('iframe');
      elm.addEventListener('load', () => {
        const doc = elm.contentWindow.document;
        const html = `<body>${code}</body>`;
        doc.open();
        doc.write(html);
        doc.write('<style> body {margin:0} </style>');
        doc.write('<script>inDapIF = true;</script>');
        doc.close();
      }, false);
    } else {
      return null;
    }
    elm.style.width = `${width}px`;
    elm.style.height = `${height}px`;
    elm.addEventListener('click', (event) => {
      if (!comp.querySelector('CompanionClickThrough')) {
        event.preventDefault();
        return;
      }
      const url = comp.querySelector('CompanionClickThrough');
      const tracks = [];
      comp.querySelectorAll('TrackingEvents Tracking').forEach((track) => {
        tracks.push(Vast.text(track));
      });
      this.myTrackAndClick(tracks, url, 'companionClickTracking', '_blank').then(() => {
        event.preventDefault();
      });
    });
    return elm;
  }

  /** **************************************************************************
   * timeupdate
   * @param  {Float} current current time
   * @return {Promise} possible to wait all beacons finished
   ****************************************************************************/
  timeupdate(current) {
    if (!this.tracking) {
      return Promise.resolve();
    }
    const promises = [];
    const trackSmaller = (name, org, target) => {
      const removes = org.filter(o => o.offset <= target);
      const remains = org;
      removes.forEach(k => delete remains[k]);
      removes.forEach(trc => promises.push(this.myDispatch(name, trc.url)));
      return remains;
    };
    this.tracks.percents = trackSmaller('percents', this.tracks.percents, (current / this.duration) * 100.0);
    this.tracks.progresses = trackSmaller('progresses', this.tracks.progresses, current);
    return Promise.all(promises);
  }

  /** **************************************************************************
   * dispatch event
   * @param  {String} eventName event name. i.e. 'impression'.
   * @return {Promise} possible to wait all beacons finished
   ****************************************************************************/
  dispatchEvent(eventName) {
    const promises = [];
    this.tracks[eventName].forEach((url) => {
      promises.push(this.myDispatch(eventName, url));
    });
    return Promise.all(promises);
  }

  /** **************************************************************************
   * click video
   * @param  {String} target target window. default is '_blank'.
   * @return {Promise} possible to wait all beacons finished
   ****************************************************************************/
  clickVideo(target = '_blank') {
    const tracks = [];
    this.vast.querySelectorAll(`${this.base} Creatives Creative Linear VideoClicks ClickTracking`).forEach((track) => {
      tracks.push(Vast.text(track));
    });
    const url = this.vast.querySelector(`${this.base} Creatives Creative Linear VideoClicks ClickThrough`);
    return this.myTrackAndClick(tracks, url, 'videoClicksTracking', target);
  }

  /** **************************************************************************
   * LOCAL : get vast xml
   * @param  {String} url  url
   * @param  {Function} resolve resolve callback
   * @param  {Function} reject  reject callback
   * @return {void}
   ****************************************************************************/
  myGetVast(url, resolve, reject) {
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
        this.myBuild(xhr.response);
        if (this.myIsWrapper()) {
          if (this.wrapperNest >= 5) {
            throw new Error('The vast wrapper is deeper 5 level nest.');
          }
          this.wrapperNest += 1;
          this.myGetVast(this.myWrapperUrl(), resolve, reject);
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
   * LOCAL : build Vast
   * @param  {XMLDocument} vast vast document
   * @return {Promise}
   ****************************************************************************/
  myBuild(vast) {
    if (typeof vast === 'undefined') {
      throw new Error('vast format error');
    }
    this.vast = vast;
    this.base = this.myIsWrapper() ? 'VAST Ad Wrapper ' : 'VAST Ad InLine ';
    this.myTrackingEvents();
    const duration = this.vast.querySelector(`${this.base} Creatives Creative Linear Duration`);
    if (duration) {
      this.duration = Vast.sec(Vast.text(duration));
    }
    this.tracking = true;
  }

  /** **************************************************************************
   * LOCAL : Check the vast is wrapper or not.
   * @return {Boolean} true:vast is wrapper, false:not
   ****************************************************************************/
  myIsWrapper() {
    return !!this.vast.querySelector('VAST Ad Wrapper');
  }

  /** **************************************************************************
   * LOCAL : Get the wrapper url.
   * @return {String} wrapped vast url
   ****************************************************************************/
  myWrapperUrl() {
    return Vast.text(this.vast.querySelector('VAST Ad Wrapper VASTAdTagURI'));
  }

  /** **************************************************************************
   * LOCAL : build tracking event urls
   * @return {void}
   ****************************************************************************/
  myTrackingEvents() {
    this.vast.querySelectorAll(`${this.base} Impression`).forEach((track) => {
      this.tracks.impressions.push(Vast.text(track));
    });

    this.vast.querySelectorAll(`${this.base} Creatives Creative Linear TrackingEvents Tracking`).forEach((track) => {
      const name = track.getAttribute('event');
      const url = Vast.text(track);
      if (name === 'progress') {
        const offset = Vast.sec(track.getAttribute('offset'));
        this.tracks.progresses.push({ offset, url });
      } else if (name === 'start') {
        this.tracks.percents.push({ offset: 0, url });
      } else if (name === 'firstQuartile') {
        this.tracks.percents.push({ offset: 25, url });
      } else if (name === 'midpoint') {
        this.tracks.percents.push({ offset: 50, url });
      } else if (name === 'thirdQuartile') {
        this.tracks.percents.push({ offset: 75, url });
      } else if (name === 'complete') {
        this.tracks.percents.push({ offset: 100, url });
      } else {
        this.tracks[name] = this.tracks[name] ? this.tracks[name] : [];
        this.tracks[name].push(url);
      }
    });
  }

  /** **************************************************************************
   * dispatch vast event
   * @param  {String} eventName event name
   * @param  {String} url beacon url
   * @return {Promise} possible to wait beacon finished
   ****************************************************************************/
  myDispatch(eventName, url) {
    const img = document.createElement('img');
    return new Promise((resolve) => {
      img.addEventListener('load', () => {
        this.target.removeChild(img);
        this.target.dispatchEvent(new CustomEvent('vastEvent', {
          detail: { eventName, url }, bubbles: true,
        }));
        if (typeof this.tracked[eventName] === 'undefined') {
          this.tracked[eventName] = [];
        }
        this.tracked[eventName].push(url);
        resolve();
      });
      img.src = url;
      img.style.cssText = 'position:absolute; top:0; left:0; width:1px; height:1px; opacity:0.1;';
      this.target.appendChild(img);
    });
  }

  /** **************************************************************************
   * get companion ad
   * @param  {Number} width companion width
   * @param  {Number} height companion height
   * @param  {Number} index index of list. default is 0.
   * @return {Element} companion element
   ****************************************************************************/
  myCompanion(width = 0, height = 0, index = 0) {
    const elms = this.vast.querySelectorAll(`${this.base} Creative CompanionAds Companion[width="${width}"][height="${height}"]`);
    const elm = elms[index];
    return elm;
  }

  /** **************************************************************************
   * LOCAL : tracking and click
   * @param  {Array} trackings tracking urls
   * @param  {String} url  click url
   * @param  {String} eventName  click event name
   * @param  {String} target  click target. default '_blank'
   * @return {Promise} possible to wait all beacons finished
   ****************************************************************************/
  myTrackAndClick(trackings, url, eventName, target = '_blank') {
    const promises = [];
    trackings.forEach((trackUrl) => {
      promises.push(this.myDispatch(eventName, trackUrl));
    });
    const a = document.createElement('a');
    return Promise.all(promises).then(() => {
      a.href = url;
      a.target = target;
      a.click();
    });
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

module.exports = Vast;
