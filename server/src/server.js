const http = require('http');
// const mongoose = require('mongoose');
const { mongoConnect } = require('./services/mongo');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;
// const MONGO_URL = 'mongodb+srv://pathemessienp:JWV9sTY4NNkQVTe7@cluster0.wykr7pz.mongodb.net/exoplanets?retryWrites=true&w=majority';
const server = http.createServer(app);

// mongoose.connection.once('open', () => {
//   console.log('MongoDB connection ready!!!');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });

const startServer = async () => {
  // await mongoose.connect(MONGO_URL);
  await mongoConnect()
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
}

startServer();