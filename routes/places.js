'use strict'

const express    = require('express');
const router     = express.Router();
const request    = require('request');
const bodyParser = require('body-parser');
const Utility    = require('./_utility.js');

router.get('/', (req, res, next) => {
  res.send({ SUCCESS: true });
});

// *** API Routes *** //
router.get('/find', findPlace); // params = location, type
router.get('/duration', findDuration);  // params = origin, destination

// *** Return a place by Type *** //
function findPlace(req, res) {
  // parse query string to retrieve origin and destination lat/lng
  let queryData = Utility.parseQueryString(req.originalUrl);

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
  myLocation + '&radius=1000&types=' + myType + '&key=' + process.env.GOOGLE_PLACES_API_KEY;

  console.log(myUrl);

  request(myUrl, (error, response, body) => {
    if(!error && response.statusCode == 200) {
      let jsonData = JSON.parse(body)['results'][0];

      // check if there are any results
      if(jsonData == undefined) {
        res.json({
          SUCCESS: false,
          MESSAGE: 'Zero Results Found',
          type:    myType
        });
        return false;
      }

      let name        = jsonData['name'];
      let address     = jsonData['vicinity'];
      let open_now    = jsonData['opening_hours'] ?
                        jsonData['opening_hours']['open_now'] : 'not shown';
      let rating      = jsonData['rating'];
      let price_level = jsonData['price_level'] ? jsonData['price_level'] : 'not shown';
      let picture_ref = jsonData['photos'] ?
                        jsonData['photos'][0]['photo_reference'] : 'not shown';
      let link        = jsonData['photos'] ?
                        jsonData['photos'][0]['html_attributions'][0] : 'not shown';
      let latitude    = jsonData['geometry']['location']['lat'];
      let longitude   = jsonData['geometry']['location']['lng'];

      let myData = {
        SUCCESS:     true,
        type:        myType,
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
  let myLocations = Utility.parseQueryString(req.originalUrl);
  let origin      = myLocations['origin'];
  let destination = myLocations['destination'];

  // check to see if query string has origin and destination
  if(origin == undefined || destination == undefined) {
    res.json({ SUCCESS: false, MESSAGE: 'Missing origin/destination '});
    return false;
  }

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


module.exports = router;
