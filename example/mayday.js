const tixcraft = require('../tixcraft');
const concertId = '16_JRI_KH/1495';

tixcraft(concertId)
  .then(areaList => {
    console.log(`場次代號：${concertId}`);
    if (areaList.length === 0) {
      console.log('empty');
      return;
    }

    areaList.forEach(area => {
      console.log(`${area.info}:\t${area.url}`);
    });
  })
  .catch(e => {
    console.error(e.stack);
  });
