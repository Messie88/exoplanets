const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path')

const parsedData = parse({
  comment: "#",
  columns: true,
});
const habitablePlanets = [];

function isHabitable(planet) {
  return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > .36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
}
const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', './kepler_data.csv'))
      .pipe(parsedData)
      .on('data', (planet) => {
        if (isHabitable(planet)) {
          habitablePlanets.push(planet);
        }
      })
      .on('error', (error) => {
        console.warn(error);
        reject(error);
      })
      .on('end', () => {
        console.log(`${habitablePlanets.length} habitable planets founds`);
        resolve();
      });
  });
}

module.exports = {
  loadPlanetsData,
  planets: habitablePlanets,
}