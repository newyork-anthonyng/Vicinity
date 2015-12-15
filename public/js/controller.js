// *** Angular Controller *** //
var app = angular.module('Vicinity', []);

app.controller('VicinityController', VicinityController);

function VicinityController($http) {
  this.currentLatitude;
  this.currentLongitude;

  // *** List of categories for Google Places Search *** //
  // this.categories = ['bar', 'cafe', 'casino', 'convenience_store',
  //                    'liquor_store', 'museum', 'park', 'restaurant',
  //                    'shopping_mall', 'points_of_interest'];
  this.categories = ['bar'];

  this.categoriesInformation = {};

  // *** Use navigator.geolocation to retrieve coordinates *** //
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

    var mapDiv = $('#map')[0];
    var map    = new google.maps.Map(mapDiv, mapProp);

    var marker = new google.maps.Marker({
      position:  myCenter,
      animation: google.maps.Animation.BOUNCE
    });
    marker.setMap(map);

    $('#map-button').hide();
    this.getCurrentWeather(this.currentLatitude, this.currentLongitude);
    this.getCategoriesInformation();
  };

  this.getCurrentWeather = function(latitude, longitude) {
    var myUrl = '/weather/find?location=' + latitude + ',' + longitude;


    function displayWeather(degrees, description) {
      var weatherDiv = $('#weather');
      var myText     = 'Current Weather: ' + Math.ceil(degrees) +
                       ' °, ' + description;

      weatherDiv.empty().append(myText);
    };

    // request weather information and display onto DOM
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

      // use 'self' to keep scope of 'this' inside AJAX call
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
      self.getTravelDistance();
    });
  };

  this.displayCategoriesInformation = function(data) {
    var newCategoryDiv = $('<div class="category-place"></div>');

    var myHeader = $('<h2>' + data.type + '</h2><hr>');
    newCategoryDiv.append(myHeader);

    var newTextDiv = $('<div></div>');

    for(var key in data) {
      switch(key) {
        case 'address':
          var newItem = $('<p>' + data['address'] + '</p>');
          newTextDiv.append(newItem);
          break;
        case 'open_now':
          if(data['open_now'] == true) {
            var newItem = $('<p class="open">Open Now!</p>');
            newTextDiv.append(newItem);
          } else if(data['open_now'] == false) {
            var newItem = $('<p class="closed">Closed</p>');
            newTextDiv.append(newItem);
          }
          break;
        case 'rating':
          var newItem = $('<p>' + data['rating'] + '</p>');
          newTextDiv.append(newItem);
          break;
        case 'price_level':
          var newItem = $('<p>' + data['price_level'] + '</p>');
          newTextDiv.append(newItem);
          break;
        case 'picture_ref':
          if(data['picture_ref'] != 'not shown') {
            var newImage = $('<img src=' + data['picture_ref'] + '></img>');
            newCategoryDiv.append(newItem);
          } else {
            var placeHolderImage = $('<div class="placeholder-image"></div>');
            newCategoryDiv.append(placeHolderImage);
          }
          break;
        default:
          continue;
          break;
      };
    }; // end of for-loop

    newCategoryDiv.append(newTextDiv);
    $('#categories').append(newCategoryDiv);
  };

  this.getTravelDistance = function() {
    var deferreds = [];

    // format time from 'seconds' to 'hh:mm'
    function formatTime(seconds) {
      var mySeconds = seconds;

      var hours = Math.floor(seconds/3600);
      mySeconds = Math.floor(mySeconds % 3600);

      var minutes = Math.floor(mySeconds/60);

      var hoursText;
      if(hours == 0) {
        hoursText = '';
      } else if(hours == 1) {
        hoursText = '1 hour';
      } else {
        hoursText = hours + ' hours';
      }

      var minutesText;
      if(minutes == 0) {
        minutesText = '';
      } else if(minutes == 1) {
        minutesText = '1 minute';
      } else {
        minutesText = minutes + ' minutes';
      }

      return hoursText + ' ' + minutesText + ' walking';
    }

    // format distance from 'meters' to 'miles'
    function formatDistance(meters) {
      var meterToMileConversion = 0.000621371;
      var conversion = (meters * meterToMileConversion).toFixed(2);

      if(conversion == 1.00) {
        return conversion + ' mile';
      } else {
        return conversion + ' miles';
      }
    };

    var myOrigin = this.currentLatitude + ',' + this.currentLongitude;

    // go through each categories-places and find the distance between the two
    for(var key in this.categoriesInformation) {
      var myCurrentCategory = this.categoriesInformation[key];

      var missingLocation = myCurrentCategory['latitude'] === undefined ||
                            myCurrentCategory['longitude'] === undefined;
      if(missingLocation) continue;

      var myDestination = myCurrentCategory['latitude'] + ',' +
                          myCurrentCategory['longitude'];
      var myUrl = '/places/duration?origin=' + myOrigin + '&destination=' +
                  myDestination;

      var self = this;

      (function getDistance (key) {
        var newRequest =
        $.ajax({
          url: myUrl
        }).done(function(response) {
          // update the categoriesInformation array with new travel key
          var travelInformation = formatDistance(response['distance']) + ', ' +
                                  formatTime(response['duration']);
          self.categoriesInformation[key]['travel'] = travelInformation;
        });

        deferreds.push(newRequest);
      })(key);

    } // end of for-loop

    $.when.apply($, deferreds).done(function() {
      for(var key in self.categoriesInformation) {
        self.displayCategoriesInformation(self.categoriesInformation[key]);
      }
    });
  };
} // ends VicinityController
