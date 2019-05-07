const axios = require('axios');
const fs = require('fs');
const parse = require('csv-parse');
const debug = require('debug')('councilTaxIngester/utils/Dataset');

async function getCsvDataAsStream(url) {
  const res = await axios({
    method: 'get',
    url: url,
    responseType: 'stream',
  });
  return res.data;
}

async function pipeStreamToFile(stream, filename) {
  const fileStream = fs.createWriteStream(filename);
  const watcher = new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    stream.on('error', reject);
    stream.pipe(fileStream);
  });
  return watcher;
}

class Dataset {
  constructor(options) {
    const {url, filename} = options;
    this.url = url;
    this.filename = filename;
  }

  async downloadFile() {
    if (this.cached) return;
    debug(`Downloading file from ${this.url}`);
    const datasetStream = await getCsvDataAsStream(this.url);
    await pipeStreamToFile(datasetStream, this.filename);
  }

  async readFileAsStream() {
    if (!this.cached) await this.downloadFile();
    return fs.createReadStream(this.filename);
  }

  get cached() {
    return fs.existsSync(this.filename);
  }

  async readFromCache() {
    const fileStream = await this.readFileAsStream();

    const watcher = new Promise((resolve, reject) => {
      const parser = parse({
        columns: true,
        trim: true,
      }, (err, records) => {
        if (err) {
          reject(err)
        } else {
          resolve(records);
        }
      });
      fileStream.pipe(parser);
    });

    return watcher;
  }
}

module.exports = Dataset;
