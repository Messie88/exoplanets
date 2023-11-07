const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://pathemessienp:JWV9sTY4NNkQVTe7@cluster0.wykr7pz.mongodb.net/exoplanets?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!!!');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const mongoConnect = async () => {
  await mongoose.connect(MONGO_URL);
}

const mongoDisconnect = async () => {
  await mongoose.disconnect();
}


module.exports = {
  mongoConnect,
  mongoDisconnect
}