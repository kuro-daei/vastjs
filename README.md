vastjs
===
Vast management module.

## Install

```bash
npm install vastjs
```

## Sample Code

```javascript
const Vast = require('vastjs');
const vast = new Vast();
vast.load('path/to/vast-url').then(() => {
  console.log(vast.duration);
  console.log(vast.media('video/mp4', 6000));
  vast.timeupdate(22.5);
});
```

## Author
[kuro-daei](https://github.com/kuro-daei)

## Repository
[GitHub](https://github.com/kuro-daei/vastjs)

## Lisence
Apache-2.0
