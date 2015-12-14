// *** Angular Controller *** //
var app = angular.module('Vicinity', []);

app.controller('VicinityController', VicinityController);

function VicinityController($http) {
  this.currentLatitude;
  this.currentLongitude;

  this.categories = ['bar', 'cafe', 'casino', 'convenience_store',
                     'liquor_store', 'museum', 'park', 'restaurant',
                     'shopping_mall', 'points_of_interest'];

  this.getCurrentLocation = function() {
    if(navigator && navigator.geolocation) {
      // use .bind(this) to be able to access Controller variables
      navigator.geolocation.getCurrentPosition(this.displayMap.bind(this));
    }
  };

  // *** Display map on DOM *** //
  this.displayMap = function(position) {
    this.currentLatitude  = position.coords.latitude;
    this.currentLongitude = position.coords.longitude;

    var myCenter = new google.maps.LatLng(this.currentLatitude, this.currentLongitude);
    var mapProp = {
      center: myCenter,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map($('#map')[0], mapProp);

    var marker = new google.maps.Marker({
      position: myCenter,
      animation: google.maps.Animation.BOUNCE
    });
    marker.setMap(map);

    // hide the map button, and show current weather
    this.hideMapButton();
    this.getCurrentWeather(this.currentLatitude, this.currentLongitude);
  };

  this.hideMapButton = function() {
    $('#map-button').hide();
  };

  this.getCurrentWeather = function(latitude, longitude) {
    var myUrl = '/weather/find?location='+ latitude + ',' + longitude;

    $http.get(myUrl)
      .then((response) => {
        // this.displayWeather(response.data);
        console.log(response.data);
        alert('degrees: ' + response.data.degrees +
              ' description: ' + response.data.description);
      });
  };
} // ends VicinityController

// app.controller('VicinityController', function($http) {
//
//   // object will have keys of the categories, and values will be objects that
//   // contain Places information retrieved from '/places/find' route
//   this.categoriesInformation = {};
//
//   // *** use browser to get current location *** //
//   this.getCurrentLocation = function() {
//     if(navigator.geolocation) {
//       // use .bind(this) to be able to access Controller variables
//       navigator.geolocation.getCurrentPosition(this.displayPositionOnMap.bind(this));
//     } else {
//       var myMap = $('#current-location-map');
//       var errorMessage = $('<p>Geolocation is not supported by this browser. \
//                         Please make sure to enable location services.</p>');
//       myMap.append(errorMessage);
//     }
//   };
//
//   // *** Get Places information for all Categories *** //
//   this.getCategoriesInformation = function() {
//     console.log('button pressed');
//
//     var deferreds = [];
//
//     for(var i = 0, j = this.categories.length; i < j; i++) {
//       var myCurrentCategory = this.categories[i];
//
//       var myUrl = '/places/find?location=' + this.currentLatitude + ',' +
//                   this.currentLongitude + '&type=' + myCurrentCategory;
//
//       var newRequest =
//         $.ajax({
//           url: myUrl
//         }).done(function(response) {
//           this.categoriesInformation[myCurrentCategory] = response;
//         });
//
//       deferreds.push(newRequest);
//     }
//
//     // perform actions have all ajax requests have resolved
//     $.when.apply($, deferreds).done(() => {
//       this.displayCategoriesInformation(this.categoriesInformation);
//     });
//   };
//
// // *** Display weather information on page *** //
// this.displayWeather = function(weatherInformation) {
//   var degrees     = weatherInformation['degrees'];
//   var description = weatherInformation['description'];
//   var weatherText = 'Current weather is ' + degrees + ', ' + description;
//
//   var myWeatherDiv = $('#weather');
//   var myInfo       = $('<p>' + weatherText + '</p>');
//   myWeatherDiv.empty().append(myInfo);
// };
//
//   // *** Display Places information for all Categories onto DOM *** //
//   this.displayCategoriesInformation = function(data) {
//
//     var placesContainer = $('#categories-places-information');
//     placesContainer.empty();
//
//     for(var category in data) {
//       var myPlace = $('<ul>' + category + '<ul>');
//
//       // go through each information in each category
//       for(var placeInformation in data[category]) {
//         myPlace.append($('<li>' + placeInformation + ': ' + data[category][placeInformation] + '</li>'));
//       }
//
//       placesContainer.append(myPlace);
//     }
//   };
//
//   // this.getCurrentLocation();  // get location on page load
// }); // end of VicinityController
