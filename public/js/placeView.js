'use strict'

angular.module('Vicinity')
  .directive('place', placeView);

console.log('place view loaded');

function placeView() {
  let directive = {};

  directive.restrict = 'E';
  directive.replace = true;
  directive.templateUrl = '_placeView.html';
  directive.scope = {
    name: '@',
    address: '@',
    open_now: '@',
    rating: '@',
    price_level: '@',
    picture_ref: '@',
    link: '@'
  }

  return directive;
}
