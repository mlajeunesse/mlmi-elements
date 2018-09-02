/*
* Toggling Mobile and Desktop
*/
export default function () {

  var obj = this;
  this.isMobile = -1;
  this.mobileCallback = undefined;
  this.desktopCallback = undefined;

  /* Check mobile on resize */
  this.resized = function()	{
		if ((obj.isMobile === -1 || !obj.isMobile) && "matchMedia" in window && window.matchMedia("(max-width: 767px)").matches){
			obj.isMobile = true;
      if (obj.mobileCallback != undefined){
        obj.mobileCallback();
      }
      window.dispatchEvent(new CustomEvent('toggle'));
		} else if ((obj.isMobile === -1 || obj.isMobile) && "matchMedia" in window && window.matchMedia("(min-width: 768px)").matches) {
			obj.isMobile = false;
      if (obj.desktopCallback != undefined){
        obj.desktopCallback();
      }
      window.dispatchEvent(new CustomEvent('toggle'));
		}
	}

  /* Add callbacks */
  this.addCallbacks = function(_mobileCallback, _desktopCallback) {
    obj.mobileCallback = _mobileCallback;
    obj.desktopCallback = _desktopCallback;
    return obj;
  }

  /* Initializer */
  $(window).on("resize orientationchange load", obj.resized);
  obj.resized();
  return this;
}
