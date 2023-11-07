const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan') // HTTP request logger middleware for node.js

const api = require('./routes/api');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(morgan('combined'));
app.use(express.json());
//Static files get after we ran npm run build from our client. This is done in order to use have a the frontend template in our node route for production
app.use(express.static(path.join(__dirname, '..', 'public')));
// Version our api
app.use('/v1', api);
app.use('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
});

module.exports = app;