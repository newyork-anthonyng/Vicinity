'use strict'

const express    = require('express');
const router     = express.Router();
const request    = require('request');
const bodyParser = require('body-parser');

router.get('/', (req, res, next) => {
  res.send({ SUCCESS: true });
});

// *** API Routes *** //
router.get('/:type', findPlaceByType);

// *** Return a place by Type *** //
function findPlaceByType(req, res) {
  let myType = req.params.type;
  console.log(myType);
  console.log(req.originalUrl);

  let myUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=' + myType + '&key=' + process.env.GOOGLE_PLACES_API_KEY;

  request(myUrl, (error, response, body) => {
    if(!error && response.statusCode == 200) {
      let jsonData = JSON.parse(body)['results'][0];

      // set up Place variables you need
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

function getPicture(reference) {
  return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+ reference + '&key=' + process.env.GOOGLE_PLACES_API_KEY;
}

module.exports = router;
