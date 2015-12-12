'use strict'

let app = angular.module('Vicinity', []);

app.controller('VicinityController', function($http) {
  this.currentLatitude;
  this.currentLongitude;

  this.categories = ['bar', 'cafe', 'casino', 'convenience_store',
                     'liquor_store', 'museum', 'park', 'restaurant',
                     'shopping_mall', 'points_of_interest'];

  // *** use browser to get current location *** //
  this.getCurrentLocation = function() {
    if(navigator.geolocation) {
      // use .bind(this) to be able to access Controller variables
      navigator.geolocation.getCurrentPosition(this.displayPositionOnMap.bind(this));
    } else {
      console.log('Geolocation is not supported by this browser. \
      Please make sure to enable location.');
    }
  };

  // *** Display location onto map *** //
  this.displayPositionOnMap = function(position) {
    // get coordinates and save into controller
    let myLatitude  = position.coords.latitude;
    let myLongitude = position.coords.longitude;
    this.currentLatitude  = myLatitude;
    this.currentLongitude = myLongitude;

    // weather test
    this.getCurrentWeather(myLatitude, myLongitude);

    // create map and with marker on current location
    let center = new google.maps.LatLng(myLatitude, myLongitude);

    let mapProp = {
      center:    center,
      zoom:      16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    let myMap  = document.getElementById('current-location-map');
    let map    = new google.maps.Map(myMap, mapProp);
    let marker = new google.maps.Marker({ position: center });
    marker.setMap(map);
  };

  this.getCurrentWeather = function(latitude, longitude) {
    let myUrl = '/weather/find?location='+ latitude + ',' + longitude;

    $http.get(myUrl)
      .then((response) => {
        console.log(response.data);
      });
  };

}); // end of VicinityController
