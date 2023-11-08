const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path')

const planets = require('./planets.mongo')

const parsedData = parse({
  comment: "#",
  columns: true,
});

function isHabitable(planet) {
  return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > .36 && planet['koi_insol'] < 1.11 && planet['koi_prad'] < 1.6;
}

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', './kepler_data.csv'))
      .pipe(parsedData)
      .on('data', async (planet) => {
        if (isHabitable(planet)) {
          await savePlanet(planet)
        }
      })
      .on('error', (error) => {
        console.warn(error);
        reject(error);
      })
      .on('end', async () => {
        console.log(`${(await getAllHabitablePlanets()).length} habitable planets founds`);
        resolve();
      });
  });
}

const getAllHabitablePlanets = async () => await planets.find({}, { '__v': 0, '_id': 0 });

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  } catch (error) {
    console.error(`Could not save planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllHabitablePlanets,
};