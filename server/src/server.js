const http = require('http');
const { mongoConnect } = require('./services/mongo');
require('dotenv').config();

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const startServer = async () => {
  await mongoConnect()
  await loadPlanetsData();
  await loadLaunchesData()

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
}

startServer();