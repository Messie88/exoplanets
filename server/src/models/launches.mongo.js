const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  // destination: { 
  //   type: mongoose.ObjectId, // Here we get the planets from an other mongoDB collection, called 'Planet' specified bellow, by id. This is a SQL approach 
  //   ref: 'Planet'
  // },
  destination: {
    type: String,
    required: true,
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true
  },
  customers: [String],
});

// Connects lauchesShema with the "lauches" collection
//                              collectionName
module.exports = mongoose.model('Launch', launchesSchema);