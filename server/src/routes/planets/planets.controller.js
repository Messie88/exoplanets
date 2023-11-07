const { getAllHabitablePlanets } = require('../../models/planets.model');

async function httpGetAllHabitablePlanets(_, res) {
  return res.status(200).json(await getAllHabitablePlanets());
}

module.exports = {
  httpGetAllHabitablePlanets,
};