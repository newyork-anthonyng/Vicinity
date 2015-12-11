'use strict'

let app = angular.module('Vicinity', []);

app.controller('VicinityController', function(){
  this.test = function() {
    console.log('testing...button clicked');
  };


});

$(function() {
  console.log('controller.js loaded');
});
