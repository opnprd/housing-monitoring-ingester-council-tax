const Dataset = require('../utils/Dataset');

const data2018 = new Dataset({
  url: 'https://datamillnorth.org/download/council-tax-bands-of-leeds-properties/87a85766-32af-4408-b973-5a0d5fd7cc06/2018.csv',
  filename: `${__dirname}/data/councilTax.csv`,
});

async function getDataset() {
  if (!data2018.cached) {
    await data2018.downloadFile();
  }

  return data2018.readFromCache();
}

module.exports = {
  getDataset,
};