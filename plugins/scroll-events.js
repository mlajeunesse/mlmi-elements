/*
* Scroll events manager
*/
$.fn.ScrollEvents = function() {
  let self = this
  self.callbacks = []
  self.requested = false

  self.add = function(callback) {
    self.callbacks.push(callback)
  }

  self.scrolled = function() {
    if (self.requested) {
      return
    }

    self.requested = true
    requestAnimationFrame(function() {
      self.callbacks.forEach(function(callback) {
        callback(self.scrollTop())
      })
      self.requested = false
    })
  }

  return function() {
    self.on('scroll load orientationchange resize', self.scrolled)
    return self
  }()
}
