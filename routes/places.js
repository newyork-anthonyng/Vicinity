'use strict'

const express    = require('express');
const router     = express.Router();
const request    = require('request');
const bodyParser = require('body-parser');

router.get('/', (req, res, next) => {
  res.send({ SUCCESS: true });
});

// *** API Routes *** //
router.get('/find/:type', findPlaceByType);
router.get('/duration', findDuration);

// *** Return a place by Type *** //
function findPlaceByType(req, res) {
  let myType = req.params.type;

  let currentLocation = parseQueryString(req.originalUrl);
  let currentLatitude = currentLocation['latitude'];
  let currentLongitude = currentLocation['longitude'];

  let myUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
  currentLatitude + ',' + currentLongitude + '&radius=500&types=' + myType + '&key=' + process.env.GOOGLE_PLACES_API_KEY;

  request(myUrl, (error, response, body) => {
    if(!error && response.statusCode == 200) {
      let jsonData = JSON.parse(body)['results'][0];

      let name        = jsonData['name'];
      let address     = jsonData['vicinity'];
      let open_now    = jsonData['opening_hours'] ?
                        jsonData['opening_hours']['open_now'] : 'not shown';
      let rating      = jsonData['rating'];
      let price_level = jsonData['price_level'] ? jsonData['price_level'] : 'not shown';
      let picture_ref = jsonData['photos'][0]['photo_reference'];
      let link        = jsonData['photos'][0]['html_attributions'][0];
      let latitude    = jsonData['geometry']['location']['lat'];
      let longitude   = jsonData['geometry']['location']['lng'];

      let myData = {
        SUCCESS:     true,
        name:        name,
        address:     address,
        open_now:    open_now,
        rating:      rating,
        price_level: price_level,
        picture_ref: getPicture(picture_ref),
        link:        link,
        latitude:    latitude,
        longitude:   longitude
      }

      res.json(myData);
    }
  });
}

// *** Return distance and time from origin to destination *** //
function findDuration(req, res) {
  // need to parseQueryString for origin and destination
  let myUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=40.572966,-74.331664&destinations=40.523000,-74.33144&mode=walking&key=' + process.env.GOOGLE_MAPS_API_KEY;
  request(myUrl, (error, response, body) => {
    if(!error && response.statusCode == 200) {
      let jsonData = JSON.parse(body)['rows'][0]['elements'][0];

      let duration = jsonData['duration']['value']; // in seconds
      let distance = jsonData['distance']['value']; // in kilometers

      let myData = {
        SUCCESS:  true,
        duration: duration,
        distance: distance
      }

      res.json(myData);
    }
  });
}

// *** Return a link to picture *** //
function getPicture(reference) {
  return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+ reference + '&key=' + process.env.GOOGLE_PLACES_API_KEY;
}

// *** Parse through query string *** //
// *** Need to parse for origin, destination and location *** //
function parseQueryString(url) {
  // example: www.google.com/base?location=10,20
  // url will have a 'location' that we will parse for

  // parse through URL for query string
  let queryString = url.split('?')[1];

  let location = queryString.split('=');
  let latitude, longitude;

  if(location[0] === 'location') {
    let commaLocation  = location[1].replace(/%2C/g, ",");
    let parsedLocation = commaLocation.split(',');

    latitude  = parsedLocation[0];
    longitude = parsedLocation[1];
  }

  return {
    latitude: latitude,
    longitude: longitude
  }
}

module.exports = router;
