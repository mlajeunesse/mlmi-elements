/*
* Toggling Mobile and Desktop
*/
export default function (mobileSize) {

  var obj = this;
  this.isMobile = -1;
  this.mobileCallback = undefined;
  this.desktopCallback = undefined;
  this.mobileSize = mobileSize ? mobileSize : 767;

  /* Check mobile on resize */
  this.resized = function()	{
		if ((obj.isMobile === -1 || !obj.isMobile) && "matchMedia" in window && window.matchMedia("(max-width: " + obj.mobileSize + "px)").matches){
			obj.isMobile = true;
      if (obj.mobileCallback != undefined){
        obj.mobileCallback();
      }
      $(window).trigger('toggle');
		} else if ((obj.isMobile === -1 || obj.isMobile) && "matchMedia" in window && window.matchMedia("(min-width: " + (obj.mobileSize + 1) + "px)").matches) {
			obj.isMobile = false;
      if (obj.desktopCallback != undefined){
        obj.desktopCallback();
      }
      $(window).trigger('toggle');
		}
	};

  /* Add callbacks */
  this.addCallbacks = function(_mobileCallback, _desktopCallback, _autoRun) {
    obj.mobileCallback = _mobileCallback;
    obj.desktopCallback = _desktopCallback;
    if (_autoRun === undefined || _autoRun == true){
      if (obj.isMobile === true){
        obj.mobileCallback();
      } else if (obj.isMobile === false){
        obj.desktopCallback();
      }
    }
    return obj;
  };

  this.kill = function() {
    this.mobileCallback = undefined;
    this.desktopCallback = undefined;
    $(window).off("resize orientationchange load", obj.resized);
  };

  /* Initializer */
  $(window).on("resize orientationchange load", obj.resized);
  obj.resized();
  return this;
}
