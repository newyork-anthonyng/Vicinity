'use strict'

let app = angular.module('Vicinity', []);

app.controller('VicinityController', function(){
  this.test = function() {
    console.log('testing...button clicked');
    initialize();
  };


});

$(function() {
  console.log('controller.js loaded');

});

function initialize() {
  let center = new google.maps.LatLng(51.508742, -0.120850);

  let mapProp = {
    center:    center,
    zoom:      10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  let map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
}
