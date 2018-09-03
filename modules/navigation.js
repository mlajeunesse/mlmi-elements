/*
* Navigation
*/
export default function () {

	require('../plugins/bem');
  const TRANSITION_END = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";

  /*
  *	Properties
  */
  var obj = this;
  this.currentURL = undefined;
  this.useTransition = true;
  this.isPopping = false;

  /*
  * Options
  */
  this.options = {
    selectors: {
      pageTransition: '.page-transition',
      pageContent: '.wrapper'
    }
  };

  /*
  * Elements
  */
  this.el = {
    pageTransition: $(this.options.selectors.pageTransition).BlockElement(),
    pageContent: $(this.options.selectors.pageContent),
  };

  /*
  *	Page display
  */
  this.pageDisplay = function(loadedURL, loadedContent)
  {
    // Display loaded page
    let response = $('<html>').html(loadedContent);
    obj.el.pageContent.replaceWith($(obj.options.selectors.pageContent, response));
    obj.el.pageContent = $(obj.options.selectors.pageContent);
    setTimeout(function(){
      if (loadedURL == obj.currentURL){
        window.dispatchEvent(new CustomEvent('page_load'));
      }
    }, 50);

    // Remove transition
    setTimeout(function(){
      obj.el.pageTransition.addModifier("hidden").on(TRANSITION_END, function(){
        obj.el.pageTransition.off(TRANSITION_END).removeModifier("visible").removeModifier("hidden");
      });
    }, 	150);

    // Push state
    if (!obj.isPopping){
      document.title = $("title", response).text();
      var data = {
        isPageTransition: true,
        previousPageURL: window.location.href
      };
      window.history.pushState(data, $("title", response).text(), obj.currentURL);
    }
    obj.isPopping = false;
  };

  /*
  *	Page transition
  */
  this.pageTransition = function(href)
  {
    // Keep current URL
    obj.currentURL = href;

    // Setting variables
    var loadedURL = href,
      loadedContent = undefined,
      pageHasDisappeared = false,
      contentHasLoaded = false;

    // Show page transition
    obj.el.pageTransition.addModifier("visible").on(TRANSITION_END, function(){
      $(this).off(TRANSITION_END);
      window.dispatchEvent(new CustomEvent('page_exit'));
      pageHasDisappeared = true;
      if (contentHasLoaded){
        obj.pageDisplay(loadedURL, loadedContent);
      }
      $.get(loadedURL, {}, function(x){
        loadedContent = x;
        contentHasLoaded = true;
        if (pageHasDisappeared){
          obj.pageDisplay(loadedURL, loadedContent);
        }
      }, 'html');
    });
  };

  /*
  * Initializer
  */
  this.init = function()
  {
    /* Pop state (back) */
    $(window).on("popstate", function(e){
      let popState = e.originalEvent.state;
      if (popState != null){
        if (popState.isPageTransition != null && popState.isPageTransition == true){
          obj.isPopping = true;
          obj.pageTransition(e.target.location.href);
        }
      }
    });

    /* Replace initial state (load) */
    window.history.replaceState({
      isPageTransition: true,
      previousPageURL: window.location.href
    }, document.title, window.location.href);

    /* Transition links */
    $(document).on("click", "a", function(e){
      if (e.originalEvent.cmdKey || e.originalEvent.metaKey){ return true; }
      if (!obj.useTransition) return true;
      if ($(this).hasClass("no-transition")){ return true; }
      if ($(this).attr("href") === "#"){ return false; }
      if ($(this).attr("target") === "_blank"){ return true; }
      obj.pageTransition($(this).attr("href"));
      return false;
    });

    /* First page load */
    window.dispatchEvent(new CustomEvent('page_load'));
    return obj;
  }();

}
