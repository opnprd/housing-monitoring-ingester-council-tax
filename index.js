const cache = require('./cache');

cache.getDataset()
  .then(JSON.stringify)
  .then(console.log);