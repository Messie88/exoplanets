const express = require('express');


const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

// launchesRouter.get('/launches', httpGetAllLaunches);
// launchesRouter.post('/launches', httpAddNewLaunch);
// Become what bellow, cz in the app.js we've set the route
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;