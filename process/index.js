const geocode = require('../cache/geocode');
const { createEvent } = require('../utils/eventStore');

async function geocodeAndAdd(event) {
  const geoEvent = await geocode(event);
  await createEvent(geoEvent);
}

async function addToEventStore(events) {
  for ( let i = 0; i < events.length; i++ ) {
    await geocodeAndAdd(events[i]);
  }
}

module.exports = {
  addToEventStore,
}


