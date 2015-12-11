'use strict'

const express    = require('express');
const router     = express.Router();
const request    = require('request');
const bodyParser = require('body-parser');

router.get('/', (req, res, next) => {
  res.send({ SUCCESS: true });
});

// *** API Routes *** //
router.get('/find', findWeather);

// *** Return weather by location *** //
function findWeather(req, res) {
  // parse query string to retrieve location
  let myLocation = parseQueryString(req.originalUrl);

  if(myLocation['location'] == undefined) {
    res.json({ SUCCESS: false, MESSAGE: 'Missing location' });
    return false;
  }

  let myLatitude = myLocation['location']['latitude'];
  let myLongitude = myLocation['location']['latitude'];

  let myUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
              myLatitude + '&lon=' + myLongitude + '&APPID=' +
              process.env.OPEN_WEATHER_API_KEY;

  request(myUrl, (error, response, body) => {
    if(!error && response.statusCode == 200) {
      let jsonData = JSON.parse(body);

      let degrees     = jsonData['main']['temp'];
      let description = jsonData['weather'][0]['description'];

      let myData = {
        SUCCESS:     true,
        degrees:     degrees,
        description: description
      }

      res.json(myData);
    }
  });
}

// *** Parse through query string *** //
// *** Need to parse for origin, destination, location and type *** //
function parseQueryString(url) {
  // parse through query string
  let formattedUrl = url.replace(/%2C/g, ',');
  let queryString  = formattedUrl.split('?')[1];

  // check to see if there was a query string
  if(!queryString) return false;

  let queryArray   = queryString.split('&');

  let myData = {};

  for(let i = 0, j = queryArray.length; i < j; i++) {
    let currentQuery = queryArray[i].split('=');

    // 'location', 'origin' and 'destination' will have latitude/longitude keys
    if(['location', 'origin', 'destination'].indexOf(currentQuery[0]) != -1) {
      let currentLocation = currentQuery[1].split(',');
      let latitude = currentLocation[0];
      let longitude = currentLocation[1];

      myData[currentQuery[0]] = {
        latitude: latitude,
        longitude: longitude
      }
    } else {
      myData[currentQuery[0]] = currentQuery[1];
    }
  }
  return myData;
}

module.exports = router;
