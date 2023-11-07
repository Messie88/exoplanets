const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');

const httpGetAllLaunches = async (_, res) => {
  return await res.status(200).json(await getAllLaunches());
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.destination || !launch.launchDate) {
    return res.status(400).json({
      error: 'Missing required launch properties',
    })
  }
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid Launch date',
    })
  }

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch)
}

const httpAbortLaunch = async (req, res) => {
  const lauchId = Number(req.params.id);
  const existLaunch = await existsLaunchWithId(lauchId)

  if (!existLaunch) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }

  const abortedLaunch = await abortLaunchById(lauchId)

  if (!abortedLaunch) {
    return res.status(400).json({
      error: "Launch not aborted"
    });
  }

  return res.status(200).json({
    ok: true
  })
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};