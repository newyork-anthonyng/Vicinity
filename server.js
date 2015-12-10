'use strict'

const express  = require('express');
const app      = express();
const logger   = require('morgan');

const placesRoutes = require('./routes/places.js');


app.use('/places', placesRoutes);

app.get('/', (req, res) => {
  res.send({ SUCCESS: true });
});

const server = app.listen(3000, () => {
  console.log('Server is running.');
});

module.exports = app;
