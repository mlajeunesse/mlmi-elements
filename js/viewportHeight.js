import $ from 'jquery';

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

export default function (options) {
  
  var test = this;
  
  this.update = function()
  {
    return 'salut';
  };

  // constructor(options) {
	// 	// Default options
	// 	this.options = {
  //     selector: '.screen',
  //     inner: '.screen__content'
  //   };
  //   if (options != undefined){
  //     if (options.selector != undefined){
  //       this.options.selector = options.selector;
  //     }
  //     if (options.inner != undefined){
  //       this.options.inner = options.inner;
  //     }
  //   }
  //   this.update();
  // }

  // update() {
  //   $(this.options.selector).each(function(){
  //     let viewportHeightFixed = $(this).MLMI_ViewportHeight(this.options);
  //     fixedElements.push(viewportHeightFixed);
  //   });
  // }

}
