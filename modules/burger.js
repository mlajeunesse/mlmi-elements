/*
*	Burger
*/

export default function (selector, options) {
  var obj = this
  this.isExpanded = false

  /*
  * Options
  */
  this.options = $.extend({
    navigation: "#navigation",
    onToggle: undefined,
  }, options)

  $.fn.Burger = function() {
    let self = this
    self.navigation = $(obj.options.navigation)

    self.clicked = function() {
      if (self.attr("aria-expanded") == "false"){
        self.attr("aria-expanded", "true")
      } else {
        self.attr("aria-expanded", "false")
      }
      obj.isExpanded = (self.attr("aria-expanded") == "true")
      self.trigger('burger_clicked')
    }

    self.maybe_close = function() {
      if (self.attr("aria-expanded") == "true"){
        self.attr("aria-expanded", "false")
      }
    }

    return function() {
      self.on("click", self.clicked)
      obj.isExpanded = (self.attr("aria-expanded") == "true")
      return self
    }()
  }

  /* Initializer */
	$(selector).each(function(){
    let burger = $(this).Burger()
    burger.on('burger_clicked', function() {
      if (obj.options.onToggle != undefined) {
        obj.options.onToggle()
      }
    })
	})

  return obj
}

/*
<button class="burger" aria-label="<?php _e('Navigation', 'mlmi') ?>" aria-expanded="false" aria-controls="navigation">
  <div class="burger__el burger__el--top"></div>
  <div class="burger__el burger__el--middle"></div>
  <div class="burger__el burger__el--bottom"></div>
</button>
*/
