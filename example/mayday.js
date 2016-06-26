const tixcraft = require('../tixcraft');

const concertId = '16_JRI_KH';
const gameId = '1495';

tixcraft(concertId, gameId)
.then(areaList => {
  console.log(`場次代號：${concertId} ${gameId}`);

  areaList.forEach(area => {
    console.log(`${area.name}:\t${area.url}`);
  });
})
.catch(e => {
  console.error(e.stack);
});
