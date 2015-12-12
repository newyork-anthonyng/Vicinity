'use strict'

let app = angular.module('Vicinity', []);

app.controller('VicinityController', function($http) {
  this.currentLatitude;
  this.currentLongitude;

  this.categories = ['bar', 'cafe', 'casino', 'convenience_store',
                     'liquor_store', 'museum', 'park', 'restaurant',
                     'shopping_mall', 'points_of_interest'];
  // this.categories = ['convenience_store', 'cafe'];


  // object will have keys of the categories, and values will be objects that
  // contain Places information retrieved from '/places/find' route
  this.categoriesInformation = {};

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

    this.getCurrentWeather(myLatitude, myLongitude);

    // create map and with marker on current location
    let center = new google.maps.LatLng(myLatitude, myLongitude);

    let mapProp = {
      center:    center,
      zoom:      16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    let myMap  = $('#current-location-map')[0];
    let map    = new google.maps.Map(myMap, mapProp);
    let marker = new google.maps.Marker({ position: center });
    marker.setMap(map);
  };

  this.getCurrentWeather = function(latitude, longitude) {
    let myUrl = '/weather/find?location='+ latitude + ',' + longitude;

    $http.get(myUrl)
      .then((response) => {
        this.displayWeather(response.data);
      });
  };

  // *** Display weather information on page *** //
  this.displayWeather = function(weatherInformation) {
    let degrees     = weatherInformation['degrees'];
    let description = weatherInformation['description'];
    let weatherText = 'Current weather is ' + degrees + ', ' + description;

    let myWeatherDiv = $('#current-temperature');
    let myInfo       = $('<p>' + weatherText + '</p>');
    myWeatherDiv.empty().append(myInfo);
  };

  // *** Get Places information for all Categories *** //
  this.getCategoriesInformation = function() {
    // deferreds will be an array of ajax requests
    let deferreds = [];
    // data will hold all of our places information
    let data = {};
    
    // loop through all categories
    for(let i = 0, j = this.categories.length; i < j; i++) {
      // make http request for each of the categories
      let myUrl = '/places/find?location=' + this.currentLatitude + ',' + this.currentLongitude + '&type=' + this.categories[i];
      let newRequest = $.ajax({
        url: myUrl
      }).done((response) => {
        data[this.categories[i]] = response;
      });

      deferreds.push(newRequest);
    }

    $.when.apply($, deferreds).done(() => {
      console.log(data);
    });

    // when http request is done, update the categoriesInformation
    // key will be the category name
    // value will be an object with the "Places" information retrieved from the ajax request

    // update the DOM when information is retrieved

  };

  this.getCurrentLocation();
}); // end of VicinityController
