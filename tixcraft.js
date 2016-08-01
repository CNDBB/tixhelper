'use strict';
const _async_  = require('co').wrap;
const cheerio  = require('cheerio');
const http     = require('http');
const https    = require('https');
const urlparse = require('url').parse;

const httpGet = (url, timeout) => new Promise((reslove, reject) => {
  const info = urlparse(url);
  const options = {
    host: info.host,
    path: info.path
  };

  const httpClient = info.protocol === 'https:' ? https : http;
  const req = httpClient.get(options, (res) => {
    if (res.statusCode !== 200) {
      const msg = `request to ${url} failed, status code = ${res.statusCode} (${res.statusMessage})`;
      return reject(new Error(msg));
    }

    const buffer = [];
    res.on('data', chunk => {
      buffer.push(chunk.toString());
    });

    res.on('end', () => {
      reslove(buffer.join(''));
    });
  })

  // timeout
  if (typeof timeout === 'number') {
    req.setTimeout(timeout, () => {
      req.abort();
      reject(new Error(`request to ${url} timeout`));
    });
  }

  req.on('error', reject);
});

/*
 * @param {String}    concertId
 * @param {Boolean!}  manual
 */
module.exports = _async_(function * (concertId, manual) {
  const host = 'http://tixcraft.com';
  const url  = `${host}/ticket/area/${concertId}`;
  const html = yield httpGet(url).catch(e => {
    throw new Error(`concert id '${concertId}' is not exist.`);
  });

  // 1. get areaUrlList
  let areaUrlList;
  eval((html.match(/areaUrlList\ =.*\;/g) || [])[0]);
  // console.log(areaUrlList);

  // 2. get area id
  const areaList = [];
  const $ = cheerio.load(html);
  $('.area-list li').each((index, element) => {
    const ele = $(element);
    const id = ele.find('a').attr('id');
    if (typeof id !== 'string') {
      return;
    }

    const area = {
      info: ele.text().trim(),
      url: host + areaUrlList[id]
    };

    // manual mode
    if (manual === true) {
      area.url.replace('ticket/ticket', 'ticket/selectSeat');
    }

    areaList.push(area);
  });

  return areaList;
});
