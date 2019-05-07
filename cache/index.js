const moment = require('moment');
const Dataset = require('../utils/Dataset');
const geocode = require('./geocode');
const debug = require('debug')('councilTaxIngester/cache');

function rawFilter(record) {
  return moment(record.band_from, 'DD.MM.YYYY').isAfter('2010-01-01');
}

function eventify(raw) {
  const address = [raw.addr1, raw.addr2, raw.addr3, raw.addr4].filter(x => x).join(', ');

  return {
    type: 'councilTaxRegistration',
    // ref: raw.property_ref, // There is a problem with ref at the moment
    ref: address,
    date: moment(raw.band_from, 'DD.MM.YYYY'),
    eventData: {
      band: raw.band,
      addr: [
        raw.addr1,
        raw.addr2,
        raw.addr3,
        raw.addr4,
      ].filter(x => x),
    }
  };
}

const data2018 = new Dataset({
  url: 'https://datamillnorth.org/download/council-tax-bands-of-leeds-properties/87a85766-32af-4408-b973-5a0d5fd7cc06/2018.csv',
  filename: `${__dirname}/data/councilTax.csv`,
});

async function getDataset() {
  if (!data2018.cached) {
    await data2018.downloadFile();
  }

  const rawEvents = await data2018.readFromCache()
    .then(data => data.filter(rawFilter))

  debug(`Got ${rawEvents.length} events from the dataset`);

  const events = rawEvents
    .map(eventify);

  debug(`Extracting ${events.length} events`);

  return events;
}

module.exports = {
  getDataset,
};