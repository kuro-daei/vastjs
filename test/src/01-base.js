const Vast = require('../../src/main.js');

describe('Base', () => {
  it('load success', (done) => {
    const vast = new Vast();
    const url = '../data/simple.xml';
    vast.load(url).then(() => {
      done();
    }).catch((error) => {
      console.log(error);
    });
  });
});
