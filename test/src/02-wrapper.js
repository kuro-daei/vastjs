const chai = require('chai');
const Vast = require('../../src/main.js');

const expect = chai.expect;

describe('Wrapper', () => {
  it('wrapper nest 1', (done) => {
    const url = '../data/wrapper1.xml';
    const vast = new Vast();
    vast.load(url).then(() => {
      const trk = vast.tracks;
      expect(trk.progresses).to.deep.have.members([
        { offset: 10, url: '/img/track.gif?progress_000010' },
        { offset: 20, url: '/img/track.gif?progress_000020' },
        { offset: 40, url: '/img/track.gif?progress_000040' },
        { offset: 45, url: '/img/track.gif?progress_000045' },
        { offset: 60, url: '/img/track.gif?progress_000060' },
        { offset: 60, url: '/img/track.gif?progress_000060_a' },
        { offset: 90, url: '/img/track.gif?progress_000090' },
        { offset: 10, url: '/img/track.gif?vast&progress_000010' },
        { offset: 20, url: '/img/track.gif?vast&progress_000020' },
        { offset: 40, url: '/img/track.gif?vast&progress_000040' },
        { offset: 45, url: '/img/track.gif?vast&progress_000045' },
        { offset: 60, url: '/img/track.gif?vast&progress_000060' },
        { offset: 60, url: '/img/track.gif?vast&progress_000060_a' },
        { offset: 90, url: '/img/track.gif?vast&progress_000090' },
      ]);
      expect(trk.percents).to.deep.have.members([
        { offset: 0, url: '/img/track.gif?start' },
        { offset: 25, url: '/img/track.gif?firstQuartile' },
        { offset: 50, url: '/img/track.gif?midpoint' },
        { offset: 75, url: '/img/track.gif?thirdQuartile' },
        { offset: 100, url: '/img/track.gif?complete' },
        { offset: 100, url: '/img/track.gif?complete_a' },
        { offset: 0, url: '/img/track.gif?vast&start' },
        { offset: 25, url: '/img/track.gif?vast&firstQuartile' },
        { offset: 50, url: '/img/track.gif?vast&midpoint' },
        { offset: 75, url: '/img/track.gif?vast&thirdQuartile' },
        { offset: 100, url: '/img/track.gif?vast&complete' },
        { offset: 100, url: '/img/track.gif?vast&complete_a' },
      ]);
      expect(trk.impressions).to.be.a('array');
      expect(trk.impressions).to.have.members([
        '/img/track.gif?imp_a', '/img/track.gif?imp',
        '/img/track.gif?vast&imp_a', '/img/track.gif?vast&imp',
      ]);
      expect(trk.close).to.have.members([
        '/img/track.gif?close', '/img/track.gif?close_a',
        '/img/track.gif?vast&close', '/img/track.gif?vast&close_a',
      ]);
      expect(trk.acceptInvitation).to.have.members([
        '/img/track.gif?acceptInvitation', '/img/track.gif?vast&acceptInvitation']);
      expect(trk.collapse).to.have.members(['/img/track.gif?collapse', '/img/track.gif?vast&collapse']);
      expect(trk.expand).to.have.members(['/img/track.gif?expand', '/img/track.gif?vast&expand']);
      expect(trk.fullscreen).to.have.members([
        '/img/track.gif?fullscreen', '/img/track.gif?vast&fullscreen']);
      expect(trk.resume).to.have.members(['/img/track.gif?resume', '/img/track.gif?vast&resume']);
      expect(trk.pause).to.have.members(['/img/track.gif?pause', '/img/track.gif?vast&pause']);
      expect(trk.unmute).to.have.members(['/img/track.gif?unmute', '/img/track.gif?vast&unmute']);
      expect(trk.mute).to.have.members(['/img/track.gif?mute', '/img/track.gif?vast&mute']);
      done();
    }).catch((error) => {
      done(error);
    });
  });

  it('wrapper nest 2', (done) => {
    const url = '../data/wrapper2.xml';
    const vast = new Vast();
    vast.load(url).then(() => {
      const trk = vast.tracks;
      expect(trk.progresses).to.deep.have.members([
        { offset: 10, url: '/img/track.gif?progress_000010' },
        { offset: 20, url: '/img/track.gif?progress_000020' },
        { offset: 40, url: '/img/track.gif?progress_000040' },
        { offset: 45, url: '/img/track.gif?progress_000045' },
        { offset: 60, url: '/img/track.gif?progress_000060' },
        { offset: 60, url: '/img/track.gif?progress_000060_a' },
        { offset: 90, url: '/img/track.gif?progress_000090' },
        { offset: 10, url: '/img/track.gif?vast&progress_000010' },
        { offset: 20, url: '/img/track.gif?vast&progress_000020' },
        { offset: 40, url: '/img/track.gif?vast&progress_000040' },
        { offset: 45, url: '/img/track.gif?vast&progress_000045' },
        { offset: 60, url: '/img/track.gif?vast&progress_000060' },
        { offset: 60, url: '/img/track.gif?vast&progress_000060_a' },
        { offset: 90, url: '/img/track.gif?vast&progress_000090' },
        { offset: 10, url: '/img/track.gif?vast&vast&progress_000010' },
        { offset: 20, url: '/img/track.gif?vast&vast&progress_000020' },
        { offset: 40, url: '/img/track.gif?vast&vast&progress_000040' },
        { offset: 45, url: '/img/track.gif?vast&vast&progress_000045' },
        { offset: 60, url: '/img/track.gif?vast&vast&progress_000060' },
        { offset: 60, url: '/img/track.gif?vast&vast&progress_000060_a' },
        { offset: 90, url: '/img/track.gif?vast&vast&progress_000090' },
      ]);
      expect(trk.percents).to.deep.have.members([
        { offset: 0, url: '/img/track.gif?start' },
        { offset: 25, url: '/img/track.gif?firstQuartile' },
        { offset: 50, url: '/img/track.gif?midpoint' },
        { offset: 75, url: '/img/track.gif?thirdQuartile' },
        { offset: 100, url: '/img/track.gif?complete' },
        { offset: 100, url: '/img/track.gif?complete_a' },
        { offset: 0, url: '/img/track.gif?vast&start' },
        { offset: 25, url: '/img/track.gif?vast&firstQuartile' },
        { offset: 50, url: '/img/track.gif?vast&midpoint' },
        { offset: 75, url: '/img/track.gif?vast&thirdQuartile' },
        { offset: 100, url: '/img/track.gif?vast&complete' },
        { offset: 100, url: '/img/track.gif?vast&complete_a' },
        { offset: 0, url: '/img/track.gif?vast&vast&start' },
        { offset: 25, url: '/img/track.gif?vast&vast&firstQuartile' },
        { offset: 50, url: '/img/track.gif?vast&vast&midpoint' },
        { offset: 75, url: '/img/track.gif?vast&vast&thirdQuartile' },
        { offset: 100, url: '/img/track.gif?vast&vast&complete' },
        { offset: 100, url: '/img/track.gif?vast&vast&complete_a' },
      ]);
      expect(trk.impressions).to.have.members([
        '/img/track.gif?imp_a', '/img/track.gif?imp',
        '/img/track.gif?vast&imp_a', '/img/track.gif?vast&imp',
        '/img/track.gif?vast&vast&imp_a', '/img/track.gif?vast&vast&imp',
      ]);
      expect(trk.close).to.have.members([
        '/img/track.gif?close', '/img/track.gif?close_a',
        '/img/track.gif?vast&close', '/img/track.gif?vast&close_a',
        '/img/track.gif?vast&vast&close', '/img/track.gif?vast&vast&close_a',
      ]);
      expect(trk.acceptInvitation).to.have.members(['/img/track.gif?acceptInvitation',
        '/img/track.gif?vast&acceptInvitation', '/img/track.gif?vast&vast&acceptInvitation']);
      expect(trk.collapse).to.have.members([
        '/img/track.gif?collapse', '/img/track.gif?vast&collapse', '/img/track.gif?vast&vast&collapse']);
      expect(trk.expand).to.have.members([
        '/img/track.gif?expand', '/img/track.gif?vast&expand', '/img/track.gif?vast&vast&expand']);
      expect(trk.fullscreen).to.have.members([
        '/img/track.gif?fullscreen',
        '/img/track.gif?vast&fullscreen', '/img/track.gif?vast&vast&fullscreen']);
      expect(trk.resume).to.have.members([
        '/img/track.gif?resume', '/img/track.gif?vast&resume', '/img/track.gif?vast&vast&resume']);
      expect(trk.pause).to.have.members([
        '/img/track.gif?pause', '/img/track.gif?vast&pause', '/img/track.gif?vast&vast&pause']);
      expect(trk.unmute).to.have.members([
        '/img/track.gif?unmute', '/img/track.gif?vast&unmute', '/img/track.gif?vast&vast&unmute']);
      expect(trk.mute).to.have.members([
        '/img/track.gif?mute', '/img/track.gif?vast&mute', '/img/track.gif?vast&vast&mute']);
      done();
    }).catch((error) => {
      done(error);
    });
  });
});
