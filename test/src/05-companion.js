const chai = require('chai');
const Vast = require('../../src/main.js');

const expect = chai.expect;
let vast;
let url;
let target;

describe('Companion', () => {
  beforeEach(() => {
    vast = new Vast(document.getElementById('target'));
    url = '../data/simple.xml';
    target = document.getElementById('target');
  });

  it('hasCompanion_300x100', (done) => {
    vast.load(url).then(() => {
      expect(vast.hasCompanion(300, 100)).to.equal(true);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('hasCompanion_300x100_1', (done) => {
    vast.load(url).then(() => {
      expect(vast.hasCompanion(300, 100, 1)).to.equal(true);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('hasCompanion_300x101_not_exist', (done) => {
    vast.load(url).then(() => {
      expect(vast.hasCompanion(300, 101)).to.equal(false);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('hasCompanion_300x100_2_not_exist', (done) => {
    vast.load(url).then(() => {
      expect(vast.hasCompanion(300, 100, 2)).to.equal(false);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('CreateCompanionElement 300x100 (img)', (done) => {
    vast.load(url).then(() => {
      const elm = vast.createCompanionElement(300, 100);
      elm.addEventListener('load', () => {
        expect(elm.tagName).to.equal('IMG');
        expect(elm.src).to.contain('/img/track.gif?companion_img&width=300&height=100');
        done();
      }, false);
      target.appendChild(elm);
    }).catch((error) => {
      done(error);
    });
  });

  it('CreateCompanionElement_300x100_img)', (done) => {
    vast.load(url).then(() => {
      const elm = vast.createCompanionElement(300, 100, 1);
      elm.addEventListener('load', () => {
        expect(elm.tagName).to.equal('IMG');
        expect(elm.src).to.contain('/img/track.gif?companion_img1&width=300&height=100');
        done();
      }, false);
      target.appendChild(elm);
    }).catch((error) => {
      done(error);
    });
  });

  it('CreateCompanionElement_400x300_iframe', (done) => {
    vast.load(url).then(() => {
      const elm = vast.createCompanionElement(400, 300);
      elm.addEventListener('load', () => {
        expect(elm.tagName).to.equal('IFRAME');
        expect(elm.src).to.contain('/img/track.gif?companion_iframe&width=400&height=300');
        done();
      }, false);
      target.appendChild(elm);
    }).catch((error) => {
      done(error);
    });
  });

  it('CreateCompanionElement_400x500_html', (done) => {
    vast.load(url).then(() => {
      const elm = vast.createCompanionElement(400, 500);
      elm.addEventListener('load', () => {
        expect(elm.tagName).to.equal('IFRAME');
        expect(elm.contentWindow.document.querySelector('div').innerText).to.contain('HTML 400x500');
        done();
      }, false);
      target.appendChild(elm);
    }).catch((error) => {
      done(error);
    });
  });

  it('click300x100', (done) => {
    const trackUrls = [];
    vast.load(url).then(() => {
      const elm = vast.createCompanionElement(300, 100);
      elm.addEventListener('load', () => {
        target.addEventListener('vastEvent', (evt) => {
          trackUrls.push(evt.detail.url);
          expect(evt.detail.eventName).to.be.equal('companionClickTracking');
          if (trackUrls.length === 2) {
            expect(trackUrls).to.have.members([
              '/img/track.gif?companion_img_track1&width=300&height=100',
              '/img/track.gif?companion_img_track2&width=300&height=100',
            ]);
            done();
          }
        }, false);
        const event = new MouseEvent('click', {
          view: window, bubbles: true, cancelable: true,
        });
        elm.dispatchEvent(event);
      }, false);
      target.appendChild(elm);
    }).catch((error) => {
      done(error);
    });
  });
});
