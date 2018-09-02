/*
* Viewport Height Fixer
*/
export default function (options) {
  
  /* Default properties */
  this.elements = [];
  this.options = {
    selector: '.screen',
    inner: '.screen__content'
  };
  
  /* jQuery object */
  $.fn.MLMI_ViewportHeight = function(options)
  {
    let self = this;
  
    self.status = {
      managed: false,
    };
  
    self.check = function()
    {
      // reset if managed
      if (self.status.managed){
        self.status.managed = false;
        self.css({
          'min-height': '',
          'height': '',
        });
      }
  
      // check heights
      let selfHeight = self.outerHeight(false),
        windowHeight = $(window).height(),
        targetHeight = windowHeight;
  
      if (self.find(options.inner).length){
        let innerHeight = self.find(options.inner).outerHeight(false);
        if (innerHeight > windowHeight){
          targetHeight = innerHeight;
        }
      }
      if (selfHeight > windowHeight){
        self.status.managed = true;
        self.css({
          'min-height': targetHeight + "px",
          'height': targetHeight + "px",
        });
      }
    };
  
    return function()
    {
      $(window).on("load orientationchange resize", self.check);
      self.find("img").on("load", function(){
        self.check();
      });
      self.check();
      return self;
    }();
  };
  
  /* Public object */
  this.update = function() {
    let obj = this;
    $(this.options.selector).each(function(){
      if (!$(this).data("element--viewport")){
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
