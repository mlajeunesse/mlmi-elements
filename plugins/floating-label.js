/*
* Floating label
*/
$.fn.FloatingLabel = function() {
  let self = this
  self.label = self.find('.field__label')
  self.field = self.find('.field__input')
  self.is_empty = self.field.val() == ''

  self.check = function() {
    if (self.field.val()) {
      self.removeClass('field--empty').addClass('field--populated')
      self.is_empty = false
    } else {
      self.removeClass('field--populated').addClass('field--empty')
      self.is_empty = true
    }
  }

  return function() {
    self.field.on('change keypress keydown keyup', self.check)
    $(window).on('load', self.check)
    self.check()
    return self
  }()
}
