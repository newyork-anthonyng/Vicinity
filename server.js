'use strict'

const express  = require('express');
const app      = express();
const logger   = require('morgan');

const placesRoutes  = require('./routes/places.js');
const weatherRoutes = require('./routes/weather.js');

app.use(logger('dev'));
app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-touch'));

// *** API Routes *** //
app.use('/places', placesRoutes);
app.use('/weather', weatherRoutes);

app.get('/', (req, res) => {
  res.send({ SUCCESS: true });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running.');
});

module.exports = app;
