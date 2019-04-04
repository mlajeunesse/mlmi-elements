import Mobile from './mobile'

/*
* Viewport Height Fixer
*/
export default function (options) {

  /* Default properties */
  var obj = this;
  this.elements = [];
  this.mobileChecker = new Mobile();
  this.options = $.extend({
    selector: '.screen',
    inner: undefined,
    desktop: true,
    mobile: true,
  }, options);

  /* jQuery object */
  $.fn.MLMI_ViewportHeight = function(options)
  {
    let self = this;

    self.is_height_set = false;

    self.check = function()
    {
      // bail if prevented by mobile or desktop rules
      if ((obj.mobileChecker.isMobile === true && obj.options.mobile === false) || (obj.mobileChecker.isMobile === false && obj.options.desktop === false)) {
        self.css({
          'min-height': '',
          'height': '',
        });
        return;
      }

      // reset if already set
      if (self.is_height_set) {
        self.is_height_set = false;
        self.css({
          'min-height': '',
          'height': '',
        });
      }

      // check heights
      let selfHeight = self.outerHeight(false),
      windowHeight = $(window).height(),
      innerHeight = self.find(options.inner).outerHeight(false),
      targetHeight = windowHeight;

      // check minimum using inner element
      if (innerHeight > windowHeight) {
        targetHeight = innerHeight;
        self.is_height_set = true;
        self.css({
          'min-height': targetHeight + "px",
          'height': targetHeight + "px",
        });
      } else if (selfHeight > windowHeight) {
        self.is_height_set = true;
        self.css({
          'min-height': targetHeight + "px",
          'height': targetHeight + "px",
        });
      }
    };

    return function()
    {
      $(window).on("load orientationchange resize", self.check);
      self.find("img").on("load", function() {
        self.check();
      });
      self.check();
      return self;
    }();
  };

  /* Public object */
  this.update = function() {
    let obj = this;
    $(this.options.selector).each(function() {
      if (!$(this).data("element--viewport")) {
        $(this).data("element--viewport", true);
        let viewportElement = $(this).MLMI_ViewportHeight(obj.options);
        obj.elements.push(viewportElement);
      }
    });
  };

  /* Initializer */
  $.extend(this.options, options);
  this.update();
  return this;
}
