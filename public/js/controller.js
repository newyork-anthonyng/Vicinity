// *** Angular Controller *** //
var app = angular.module('Vicinity', []);

app.controller('VicinityController', VicinityController);

function VicinityController($http) {
  this.test = function() {
    $('#test').toggleClass('tap');
  };

  this.route = function() {
    $http.get('/test')
      .then(function(response) {
        var messageDiv = $('#message');
        messageDiv.empty().append('<p>' + response.data.MESSAGE + '</p>');
      });
  };

  this.getCurrentLocation = function() {
    if(navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.displayMap);
    }
  };

  this.displayMap = function(position) {
    var myCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapProp = {
      center: myCenter,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map($('#map')[0], mapProp);

    var marker = new google.maps.Marker({
      position: myCenter,
      animation: google.maps.Animation.BOUNCE
    });
    marker.setMap(map);
  };
} // ends controller

// app.controller('VicinityController', function($http) {
//   this.test = function() {
//     alert('Button pressed');
//   };
//
//   this.currentLatitude;
//   this.currentLongitude;
//
//   this.categories = ['bar', 'cafe', 'casino', 'convenience_store',
//                      'liquor_store', 'museum', 'park', 'restaurant',
//                      'shopping_mall', 'points_of_interest'];
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
//   // *** Display location onto map *** //
//   this.displayPositionOnMap = function(position) {
//     // get coordinates and save into controller
//     var myLatitude  = position.coords.latitude;
//     var myLongitude = position.coords.longitude;
//     this.currentLatitude  = myLatitude;
//     this.currentLongitude = myLongitude;
//
//     this.getCurrentWeather(myLatitude, myLongitude);
//
//     // create map and with marker on current location
//     var center = new google.maps.LatLng(myLatitude, myLongitude);
//
//     var mapProp = {
//       center:    center,
//       zoom:      16,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//
//     var myMap  = $('#current-location-map')[0];
//     var map    = new google.maps.Map(myMap, mapProp);
//     var marker = new google.maps.Marker({ position: center });
//     marker.setMap(map);
//   };
//
//   this.getCurrentWeather = function(latitude, longitude) {
//     var myUrl = '/weather/find?location='+ latitude + ',' + longitude;
//
//     $http.get(myUrl)
//       .then((response) => {
//         this.displayWeather(response.data);
//       });
//   };
//
//   // *** Display weather information on page *** //
//   this.displayWeather = function(weatherInformation) {
//     var degrees     = weatherInformation['degrees'];
//     var description = weatherInformation['description'];
//     var weatherText = 'Current weather is ' + degrees + ', ' + description;
//
//     var myWeatherDiv = $('#current-temperature');
//     var myInfo       = $('<p>' + weatherText + '</p>');
//     myWeatherDiv.empty().append(myInfo);
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
