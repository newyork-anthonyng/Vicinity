'use strict'

const express    = require('express');
const router     = express.Router();
const request    = require('request');
const bodyParser = require('body-parser');

router.get('/', (req, res, next) => {
  res.send({ SUCCESS: true });
});

// *** API Routes *** //
router.get('/find', findPlace);
router.get('/duration', findDuration);

// *** Return a place by Type *** //
function findPlace(req, res) {
  // parse query string to retrieve origin and destination lat/lng
  let queryData = parseQueryString(req.originalUrl);

  // check to see if query string has 'type' and 'location'
  let myType = queryData['type'];
  if (myType == undefined) {
    res.json({ SUCCESS: false, MESSAGE: 'Missing type' });
    return false;
  }

  if(queryData['location'] == undefined) {
    res.json({ SUCCESS: false, MESSAGE: 'Missing location' });
    return false;
  }
  let myLatitude = queryData['location']['latitude'];
  let myLongitude = queryData['location']['longitude'];
  let myLocation = myLatitude + ',' + myLongitude;

  let myUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
  myLocation + '&radius=500&types=' + myType + '&key=' + process.env.GOOGLE_PLACES_API_KEY;

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
  let myLocations = parseQueryString(req.originalUrl);
  let origin      = myLocations['origin'];
  let destination = myLocations['destination'];

  let originLocation      = origin['latitude'] + ',' + origin['longitude'];
  let destinationLocation = destination['latitude']
                            + ',' + destination['longitude'];

  let myUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='
              + originLocation + '&destinations=' + destinationLocation
              + '&mode=walking&key=' + process.env.GOOGLE_MAPS_API_KEY;

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
  return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='
          + reference + '&key=' + process.env.GOOGLE_PLACES_API_KEY;
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
