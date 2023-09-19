const express = require('express');
const cors = require('cors');
const path = require('path')
const planetsRouter = require('./routes/planets/planets.router')

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
}))
app.use(express.json());
//Static files get after we ran npm run build from our client
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(planetsRouter)
app.use('/', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app;