'use strict'

let Utility = {
  // *** Parse through query string *** //
  // *** Need to parse for origin, destination, location and type *** //
  parseQueryString: function(url) {
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
}

module.exports = Utility;
