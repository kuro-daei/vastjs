const chai = require('chai');
const Vast = require('../../src/main.js');

const expect = chai.expect;

describe('Base', () => {
  it('load success', (done) => {
    const vast = new Vast();
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('constructor', (done) => {
    const vast = new Vast();
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      expect(vast.duration).to.be.equal(90);
      expect(vast.tracked).to.be.an('array');
      expect(vast.tracked).to.have.lengthOf(0);
      expect(vast.tracking).to.be.equal(true);
      expect(vast.tracks).to.be.an('object');
      expect(Object.keys(vast.tracks)).to.have.lengthOf(15);
      const trk = vast.tracks;
      expect(trk.progresses).to.deep.have.members([
        { offset: 10, url: '/img/track.gif?progress_000010' },
        { offset: 20, url: '/img/track.gif?progress_000020' },
        { offset: 40, url: '/img/track.gif?progress_000040' },
        { offset: 45, url: '/img/track.gif?progress_000045' },
        { offset: 60, url: '/img/track.gif?progress_000060' },
        { offset: 60, url: '/img/track.gif?progress_000060_a' },
        { offset: 90, url: '/img/track.gif?progress_000090' },
      ]);
      expect(trk.percents).to.deep.have.members([
        { offset: 0, url: '/img/track.gif?start' },
        { offset: 25, url: '/img/track.gif?firstQuartile' },
        { offset: 50, url: '/img/track.gif?midpoint' },
        { offset: 75, url: '/img/track.gif?thirdQuartile' },
        { offset: 100, url: '/img/track.gif?complete' },
        { offset: 100, url: '/img/track.gif?complete_a' },
      ]);
      expect(trk.impressions).to.have.members([
        '/img/track.gif?imp_a', '/img/track.gif?imp',
      ]);
      expect(trk.close).to.have.members([
        '/img/track.gif?close', '/img/track.gif?close_a',
      ]);
      expect(trk.acceptInvitation).to.have.members(['/img/track.gif?acceptInvitation']);
      expect(trk.collapse).to.have.members(['/img/track.gif?collapse']);
      expect(trk.expand).to.have.members(['/img/track.gif?expand']);
      expect(trk.fullscreen).to.have.members(['/img/track.gif?fullscreen']);
      expect(trk.resume).to.have.members(['/img/track.gif?resume']);
      expect(trk.pause).to.have.members(['/img/track.gif?pause']);
      expect(trk.unmute).to.have.members(['/img/track.gif?unmute']);
      expect(trk.mute).to.have.members(['/img/track.gif?mute']);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('vast not found', (done) => {
    const vast = new Vast();
    const url = '../data/simple_notfound.xml';
    vast.load(url).then(() => {
      done('Error');  // expect Error throw
    }, () => {
      done();
    });
  });
});
