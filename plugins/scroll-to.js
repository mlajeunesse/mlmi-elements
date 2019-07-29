/*
* Animated scroll to
*/
$.fn.scrollTo = function(target, baseDuration, distanceQuotient) {
  /* Default values */
  if (typeof baseDuration == 'undefined') {
    baseDuration = 500
  }
  if (typeof distanceQuotient == 'undefined') {
    distanceQuotient = 4
  }

  /* Scroll animated */
  let distance = Math.abs(target - $(this).scrollTop())
  $(this).animate({'scrollTop' : target}, baseDuration + distance / distanceQuotient, 'swing')

  /* Allow breaking of scroll on mousewheel */
  $(this).one('mousewheel', function() {
    $(this).stop()
  })
}
