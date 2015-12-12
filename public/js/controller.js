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
      let myMap = $('#current-location-map');
      let errorMessage = $('<p>Geolocation is not supported by this browser. \
                        Please make sure to enable location services.</p>');
      myMap.append(errorMessage);
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
    console.log('button pressed');

    let deferreds = [];

    for(let i = 0, j = this.categories.length; i < j; i++) {
      let myCurrentCategory = this.categories[i];

      let myUrl = '/places/find?location=' + this.currentLatitude + ',' +
                  this.currentLongitude + '&type=' + myCurrentCategory;

      let newRequest =
        $.ajax({
          url: myUrl
        }).done((response) => {
          this.categoriesInformation[myCurrentCategory] = response;
        });

      deferreds.push(newRequest);
    }

    // perform actions have all ajax requests have resolved
    $.when.apply($, deferreds).done(() => {
      this.displayCategoriesInformation(this.categoriesInformation);
    });
  };

  // *** Display Places information for all Categories onto DOM *** //
  this.displayCategoriesInformation = function(data) {

    let placesContainer = $('#categories-places-information');
    placesContainer.empty();

    for(let category in data) {
      let myPlace = $('<ul>' + category + '<ul>');

      // go through each information in each category
      for(let placeInformation in data[category]) {
        myPlace.append($('<li>' + placeInformation + ': ' + data[category][placeInformation] + '</li>'));
      }

      placesContainer.append(myPlace);
    }
  };

  this.getCurrentLocation();  // get location on page load
}); // end of VicinityController
