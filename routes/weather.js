'use strict'

const express    = require('express');
const router     = express.Router();
const request    = require('request');
const bodyParser = require('body-parser');
const Utility    = require('./_utility');

router.get('/', (req, res, next) => {
  res.send({ SUCCESS: true });
});

// *** API Routes *** //
router.get('/find', findWeather);

// *** Return weather by location *** //
function findWeather(req, res) {
  // parse query string to retrieve location
  let myLocation = Utility.parseQueryString(req.originalUrl);

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


module.exports = router;
