const chai = require('chai');
const Vast = require('../../src/main.js');

const expect = chai.expect;
let vast;
let url;

describe('Mediafile', () => {
  beforeEach(() => {
    vast = new Vast(document.getElementById('target'));
    url = '../data/simple.xml';
  });

  it('mp4 w/ dedfault parameters', (done) => {
    vast.load(url).then(() => {
      const media = vast.media('video/mp4');
      expect(media).to.equal('medias/1000.mp4');
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('mp4 w/ 6000kbps', (done) => {
    vast.load(url).then(() => {
      const media = vast.media('video/mp4', 6000);
      expect(media).to.equal('medias/5226.mp4');
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('webm w/ dedfault parameters', (done) => {
    vast.load(url).then(() => {
      const media = vast.media('video/webm');
      expect(media).to.equal('medias/1500.webm');
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('mp4 w/ too small bps', (done) => {
    vast.load(url).then(() => {
      const media = vast.media('video/mp4', 100);
      expect(media).to.equal(null);
      done();
    }).catch((error) => {
      done(error);
    });
  });
});
