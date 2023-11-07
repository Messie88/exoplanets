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

//                                                       find all but exclude __v and _id params
const getAllHabitablePlanets = async () => await planets.find({}, { '__v': 0, '_id': 0 });

async function savePlanet(planet) {
  try {
    // habitablePlanets.push(planet);
    // TODO: Replace below create with  insert + update = upsert to save our planets only once when the server reloads, that way our planet will be added only if it doesn't exist in ou DB
    // await planets.create({
    //   keplerName: planet.kepler_name,
    // });
    await planets.updateOne({
      keplerName: planet.kepler_name, // find data, if it doesn't exist add it
    }, {
      keplerName: planet.kepler_name, // if it already exist update with the new value
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