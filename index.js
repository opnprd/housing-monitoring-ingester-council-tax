const cache = require('./cache');
const { addToEventStore } = require('./process');

cache.getDataset()
  .then(addToEventStore)