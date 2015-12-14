// *** Angular Controller *** //
var app = angular.module('Vicinity', []);

app.controller('VicinityController', VicinityController);

function VicinityController($http) {
  this.currentLatitude;
  this.currentLongitude;

  this.categories = ['bar', 'cafe', 'casino', 'convenience_store',
                     'liquor_store', 'museum', 'park', 'restaurant',
                     'shopping_mall', 'points_of_interest'];

  this.categoriesInformation = {};

  this.getCurrentLocation = function() {
    if(navigator && navigator.geolocation) {
      // use .bind(this) to be able to access Controller variables
      navigator.geolocation.getCurrentPosition(this.displayMap.bind(this));
    } else {
      alert('Please turn on location services in your browser.');
    }
  };

  // *** Display map on DOM *** //
  this.displayMap = function(position) {
    this.currentLatitude  = position.coords.latitude;
    this.currentLongitude = position.coords.longitude;

    var myCenter = new google.maps
                  .LatLng(this.currentLatitude, this.currentLongitude);

    var mapProp = {
      center:    myCenter,
      zoom:      15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map($('#map')[0], mapProp);

    var marker = new google.maps.Marker({
      position:  myCenter,
      animation: google.maps.Animation.BOUNCE
    });
    marker.setMap(map);

    $('#map-button').hide();
    this.getCurrentWeather(this.currentLatitude, this.currentLongitude);
  };

  this.getCurrentWeather = function(latitude, longitude) {
    var myUrl = '/weather/find?location=' + latitude + ',' + longitude;

    var displayWeather = function(degrees, description) {
      var weatherDiv = $('#weather');
      var myText     = 'Current weather: ' + degrees + ' & ' + description;
      weatherDiv.empty().append(myText);
    };

    $http.get(myUrl)
      .then(function(response) {
        var myDegrees     = response.data.degrees;
        var myDescription = response.data.description;

        displayWeather(myDegrees, myDescription);
      });
  };

  this.getCategoriesInformation = function() {
    var deferreds = [];

    for(var i = 0, j = this.categories.length; i < j; i++) {
      var myCurrentCategory = this.categories[i];
      var myUrl = '/places/find?location=' + this.currentLatitude + ',' +
                  this.currentLongitude + '&type=' + myCurrentCategory;

      // use 'self' to keep scope of this inside of AJAX call
      var self = this;

      var newRequest =
        $.ajax({
          url: myUrl
        }).done(function(response) {
          self.categoriesInformation[response.type] = response;
        });

      deferreds.push(newRequest);
    } // end of for-loop

    $.when.apply($, deferreds).done(function() {
      // display information for each category
      for(var key in self.categoriesInformation) {
        self.displayCategoriesInformation(self.categoriesInformation[key]);
      }
    });

  };

  this.displayCategoriesInformation = function(data) {
    alert(data.type);
  };

} // ends VicinityController

// app.controller('VicinityController', function($http) {

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
