const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 22, 2023'),
  destination: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

// Initialize/Instantiate our launches map
//           key                 value
// launches.set(launch.flightNumber, launch);

const existsLaunchWithId = async (launchId) => await launchesDataBase.findOne({ flightNumber: launchId });

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDataBase
    .findOne()
    .sort('-flightNumber'); // the minus - sort in descending order

  if (!latestLaunch) { // If there is no launch in our DB
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

const getAllLaunches = async () => {
  return await launchesDataBase.find({}, { '_id': 0, '__v': 0 })
};

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.destination,
  });

  if (!planet) {
    throw new Error('No planet was found');
  }

  await launchesDataBase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  });
}

const scheduleNewLaunch = async (launch) => {
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
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
}

// IT'S A GOOD IDEA TO KEEP THE DATA AND ALL ITS TRANSFOMATIONS INSIDE MODEL