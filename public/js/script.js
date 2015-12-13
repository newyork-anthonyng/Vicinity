$(document).on('pageinit', function() {
  console.log('page loaded');
  $('#test').bind('tap', tapHandler);
});

function tapHandler() {
  $('#test').toggleClass('tap');
}
