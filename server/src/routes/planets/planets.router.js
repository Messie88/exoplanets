const express = require('express');

const { httpGetAllHabitablePlanets } = require('./planets.controller')

const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllHabitablePlanets);

module.exports = planetsRouter;