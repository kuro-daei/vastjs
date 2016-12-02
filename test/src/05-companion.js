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

  it('hasCompanion 300x100', (done) => {
    vast.load(url).then(() => {
      expect(vast.hasCompanion(300, 100)).to.equal(true);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('hasCompanion 300x100 index 1', (done) => {
    vast.load(url).then(() => {
      expect(vast.hasCompanion(300, 100, 1)).to.equal(true);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('hasCompanion 300x101 (not exist)', (done) => {
    vast.load(url).then(() => {
      expect(vast.hasCompanion(300, 101)).to.equal(false);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('hasCompanion 300x100 and index 2 (not exist)', (done) => {
    vast.load(url).then(() => {
      expect(vast.hasCompanion(300, 100, 2)).to.equal(false);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('CreateCompanionElement 300x100 (img)', (done) => {
    vast.load(url).then(() => {
      const elm = vast.createCompanionElement(target, 300, 100);
      expect(elm.tagName).to.equal('IMG');
      expect(elm.src).to.contain('/img/track.gif?companion_img&width=300&height=100');
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('CreateCompanionElement 300x100 and index 1 (img)', (done) => {
    vast.load(url).then(() => {
      const elm = vast.createCompanionElement(target, 300, 100, 1);
      expect(elm.tagName).to.equal('IMG');
      expect(elm.src).to.contain('/img/track.gif?companion_img1&width=300&height=100');
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('CreateCompanionElement 400x300 (iframe)', (done) => {
    vast.load(url).then(() => {
      const elm = vast.createCompanionElement(target, 400, 300);
      expect(elm.tagName).to.equal('IFRAME');
      expect(elm.src).to.contain('/img/track.gif?companion_iframe&width=400&height=300');
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('CreateCompanionElement 400x500 (html)', (done) => {
    vast.load(url).then(() => {
      const elm = vast.createCompanionElement(target, 400, 500);
      expect(elm.tagName).to.equal('IFRAME');
      expect(elm.contentWindow.document.querySelector('div').innerText).to.contain('HTML 400x500');
      done();
    }).catch((error) => {
      done(error);
    });
  });
});
