const level = require('level');
const db = level('cache/data/geocoding');
const debug = require('debug')('councilTaxIngester/cache/geocode');

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.API_KEY,
  Promise: Promise,
});

let limiter = Promise.resolve();

async function geocodeWithGoogle(address) {
  await limiter;

  const geocoded = await googleMapsClient
    .geocode({ address })
    .asPromise()
    .then(data => data.json.results);

  limiter = new Promise((resolve, reject) => setTimeout(resolve, 20));

  return geocoded;
}

async function geocode(data) {
  const { ref } = data;
  const address = data.eventData.addr.join(', ');
  let position;
  try {
    position = await db.get(ref).then(JSON.parse);
    debug(position);
  } catch(error) {
    if (error.type !== 'NotFoundError') throw error

    debug('Geocoding with google API');
    const geocoded = await geocodeWithGoogle(address);

    if (geocoded.length !== 1) return data;
    
    // address_encoded, geometry.location
    position = [ geocoded[0].geometry.location.lng, geocoded[0].geometry.location.lat ];
    db.put(ref, JSON.stringify(position));
  }
  return {
    ...data,
    geometry: {
      type: 'Point',
      coordinates: position,
    },
  };
}

module.exports = geocode;