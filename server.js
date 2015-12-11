'use strict'

const express  = require('express');
const app      = express();
const logger   = require('morgan');

const placesRoutes = require('./routes/places.js');
const weatherRoutes = require('./routes/weather.js');

app.use('/places', placesRoutes);
app.use('/weather', weatherRoutes);

app.get('/', (req, res) => {
  res.send({ SUCCESS: true });
});

const server = app.listen(3000, () => {
  console.log('Server is running.');
});

module.exports = app;
