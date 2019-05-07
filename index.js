const cache = require('./cache');

cache.getDataset()
  .then(x => JSON.stringify(x, null, 2))
  .then(console.log);