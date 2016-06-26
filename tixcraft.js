const co = require('co');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const host = 'http://tixcraft.com';

/*
 * @param {String}    concertId
 * @param {String}    gameId
 * @param {Boolean!}  manual
 */
module.exports = co.wrap(function * (concertId, gameId, manual) {
  const url = [host, 'ticket/area', concertId, gameId].join('/');
  const res = yield fetch(url);
  const html = yield res.text();

  // 1. var areaUrlList = ...
  eval(html.match(/var\ areaUrlList\ =.*\;/g)[0]);
  // console.log(areaUrlList);

  // 2. get area id
  const areaList = [];
  const $ = cheerio.load(html);
  $('.area-list li').each((i, e) => {
    const ele = $(e);
    const id = ele.find('a').attr('id');
    if (typeof id !== 'string') {
      return;
    }

    const area = {
      info: ele.text(),
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
