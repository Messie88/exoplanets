const { planets } = require('../../models/planets.model');

function getAllPlanets(_, res) {
  return res.status(200).json(planets);
}

module.exports = {
  getAllPlanets,
};