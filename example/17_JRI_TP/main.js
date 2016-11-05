const tixcraft = require('../../tixcraft');
const co = require('co');

// TOYOTAx五月天 RE:LIVE JUST ROCK IT! 2016最終章[自傳復刻版]
const concertList = {
  '2016/12/17 (六)': '17_JRI_TP/2297',
  '2016/12/18 (日)': '17_JRI_TP/2298',
  '2016/12/21 (三)': '17_JRI_TP/2299',
  '2016/12/23 (五)': '17_JRI_TP/2300',
  '2016/12/24 (六)': '17_JRI_TP/2301',
  '2016/12/25 (日)': '17_JRI_TP/2302',
  '2016/12/30 (五)': '17_JRI_TP/2303',
  '2016/12/31 (六)': '17_JRI_TP/2304',
  '2017/01/01 (日)': '17_JRI_TP/2305'
};

co(function * () {
  for (const name in concertList) {
    const code = concertList[name];
    console.log(`場次：${name}  --  ${code}`);

    try {
      const areaList = yield tixcraft(code);
      if (areaList.length === 0) {
        console.log('empty');
      } else {
        areaList.forEach(area => {
          console.log(`${area.info}:\t${area.url}`);
        });
      }
    } catch (e) {
      console.error(e.stack);
    }

    console.log('\n');
  }
})
.catch(e => {
  console.error(e.stack);
});
