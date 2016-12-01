const chai = require('chai');
const Vast = require('../../src/main.js');

const expect = chai.expect;

describe('Events', () => {
  it('progress & percents 0s', (done) => {
    const vast = new Vast(document.getElementById('target'));
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      vast.timeupdate(0).then(() => {
        expect(vast.tracked).to.have.members(['/img/track.gif?start']);
        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });

  it('progress & percents 22.5s', (done) => {
    const vast = new Vast(document.getElementById('target'));
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      vast.timeupdate(22.5).then(() => {
        expect(vast.tracked).to.have.members([
          '/img/track.gif?start', '/img/track.gif?firstQuartile',
          '/img/track.gif?progress_000010', '/img/track.gif?progress_000020',
        ]);
        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });

  it('progress & percents 45s', (done) => {
    const vast = new Vast(document.getElementById('target'));
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      vast.timeupdate(45).then(() => {
        expect(vast.tracked).to.have.members([
          '/img/track.gif?start', '/img/track.gif?firstQuartile', '/img/track.gif?midpoint',
          '/img/track.gif?progress_000010', '/img/track.gif?progress_000020', '/img/track.gif?progress_000040', '/img/track.gif?progress_000045',
        ]);
        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });

  it('progress & percents 90s', (done) => {
    const vast = new Vast(document.getElementById('target'));
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      vast.timeupdate(90).then(() => {
        expect(vast.tracked).to.have.members([
          '/img/track.gif?start', '/img/track.gif?firstQuartile', '/img/track.gif?midpoint', '/img/track.gif?thirdQuartile', '/img/track.gif?complete', '/img/track.gif?complete_a',
          '/img/track.gif?progress_000010', '/img/track.gif?progress_000020', '/img/track.gif?progress_000040', '/img/track.gif?progress_000045',
          '/img/track.gif?progress_000060_a', '/img/track.gif?progress_000060', '/img/track.gif?progress_000090',
        ]);
        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });

  it('impression', (done) => {
    const vast = new Vast(document.getElementById('target'));
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      vast.dispatchEvent('impressions').then(() => {
        expect(vast.tracked).to.have.members(['/img/track.gif?imp', '/img/track.gif?imp_a']);
        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });

  it('creativeView', (done) => {
    const vast = new Vast(document.getElementById('target'));
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      vast.dispatchEvent('creativeView').then(() => {
        expect(vast.tracked).to.have.members(['/img/track.gif?creativeView']);
        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });

  it('other events', (done) => {
    const vast = new Vast(document.getElementById('target'));
    const url = '../data/simple.xml';
    const promises = [];
    vast.load(url).then(() => {
      promises.push(vast.dispatchEvent('close'));
      promises.push(vast.dispatchEvent('acceptInvitation'));
      promises.push(vast.dispatchEvent('collapse'));
      promises.push(vast.dispatchEvent('expand'));
      promises.push(vast.dispatchEvent('fullscreen'));
      promises.push(vast.dispatchEvent('exitFullscreen'));
      promises.push(vast.dispatchEvent('resume'));
      promises.push(vast.dispatchEvent('pause'));
      promises.push(vast.dispatchEvent('unmute'));
      promises.push(vast.dispatchEvent('mute'));
      Promise.all(promises).then(() => {
        expect(vast.tracked).to.have.members([
          '/img/track.gif?close',
          '/img/track.gif?close_a',
          '/img/track.gif?acceptInvitation',
          '/img/track.gif?collapse',
          '/img/track.gif?expand',
          '/img/track.gif?fullscreen',
          '/img/track.gif?exitFullscreen',
          '/img/track.gif?resume',
          '/img/track.gif?pause',
          '/img/track.gif?unmute',
          '/img/track.gif?mute',
        ]);
        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });

  it('video click', (done) => {
    const vast = new Vast(document.getElementById('target'));
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      vast.clickVideo().then(() => {
        expect(vast.tracked).to.have.members(['/img/track.gif?click']);
        done();
      }).catch((error) => {
        done(error);
      });
    }).catch((error) => {
      done(error);
    });
  });
});
