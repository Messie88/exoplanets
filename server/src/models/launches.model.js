const axios = require('axios')

const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const populateLaunches = async () => {
  console.log("DOWNLOADING Launches ...");

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          }
        }
      ]
    }
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads
    const customers = payloads.flatMap((payload) => {
      return payload.customers
    });

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      // destination: 'Kepler-442 b', // not applicable  from SpaceX 
      customers,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
    };

    console.log(launch.flightNumber, launch.mission);

    saveLaunch(launch);
  }
}

const loadLaunchesData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launch data already loaded');
    return;
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDataBase.findOne(filter);
}

const existsLaunchWithId = async (launchId) => await findLaunch({ flightNumber: launchId });

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDataBase
    .findOne()
    .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

const getAllLaunches = async (skip, limit) => {
  return await launchesDataBase.find({}, { '_id': 0, '__v': 0 })
    .skip(skip)
    .limit(limit)
    .sort({
      flightNumber: 1
    })
};

async function saveLaunch(launch) {
  await launchesDataBase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  });
}

const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.destination,
  });

  if (!planet) {
    throw new Error('No planet was found');
  }
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDataBase.updateOne({ flightNumber: launchId }, {
    upcoming: false,
    success: false,
  });

  return aborted.modifiedCount === 1;
};

module.exports = {
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
}