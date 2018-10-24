import { TRANSITION_END } from '../utils';
import '../plugins/bem';

/*
* Navigation
*/
export default function (options) {

  /*
  *	Properties
  */
  var obj = this;
  this.currentURL = undefined;
	this.isLoading = false;
  this.isPopping = false;

  /*
  * Options
  */
  this.options = $.extend({
    init: true,
    useTransition: true,
    useEvents: true,
    selectors: {
      pageTransition: '.page-transition',
      pageContent: '.wrapper',
      pageTarget: '.wrapper'
    }
  }, options);

  /*
  * Elements
  */
  this.el = {
    pageTransition: (this.options.useTransition) ? $(this.options.selectors.pageTransition).BlockElement() : undefined,
    pageTarget: $(this.options.selectors.pageTarget),
  };

  /*
  *	Page display
  */
  this.pageDisplay = function(targetURL, loadedContent)
  {
    // Display loaded page
    let response = $('<html>').html(loadedContent);
    obj.el.pageTarget.replaceWith($(obj.options.selectors.pageContent, response));
    obj.el.pageTarget = $(obj.options.selectors.pageTarget);
    setTimeout(function(){
      if (targetURL == obj.currentURL){
				obj.isLoading = false;
        if (obj.options.useEvents){
          window.dispatchEvent(new CustomEvent('page_load'));
        }
      }
    }, 50);

    // Remove transition
    if (obj.options.useTransition){
      setTimeout(function(){
        obj.el.pageTransition.addModifier("hidden").on(TRANSITION_END, function(){
          obj.el.pageTransition.off(TRANSITION_END).removeModifier("visible").removeModifier("hidden");
        });
      }, 	150);
    }

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
  this.getPage = function(href, callback)
  {
    // Keep current URL
    obj.currentURL = href;

    // Default callback
    if (callback == undefined){
      callback = obj.pageDisplay;
      obj.isUsingCustomCallback = true;
    } else {
      obj.isUsingCustomCallback = false;
    }

    // Setting variables
    var targetURL = href,
      loadedContent = undefined,
      pageHasDisappeared = false,
      contentHasLoaded = false;

    // Show page transition
		obj.isLoading = true;
    if (obj.options.useTransition){
      obj.el.pageTransition.addModifier("visible").on(TRANSITION_END, function(){
        $(this).off(TRANSITION_END);
        if (obj.options.useEvents){
          window.dispatchEvent(new CustomEvent('page_exit'));
        }
        pageHasDisappeared = true;
        if (contentHasLoaded){
          callback(targetURL, loadedContent);
        }
      });
      $.get(targetURL, {}, function(x){
        loadedContent = x;
        contentHasLoaded = true;
        if (pageHasDisappeared){
          callback(targetURL, loadedContent);
        }
      }, 'html');
    } else {
      if (obj.options.useEvents){
        window.dispatchEvent(new CustomEvent('page_exit'));
      }
      $.get(targetURL, {}, function(x){
        loadedContent = x;
        callback(targetURL, loadedContent);
      }, 'html');
    }
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
          obj.getPage(e.target.location.href);
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
      if ($(this).hasClass("no-transition")){ return true; }
      if ($(this).attr("href") === "#"){ return false; }
      if ($(this).attr("target") === "_blank"){ return true; }
      obj.getPage($(this).attr("href"));
      return false;
    });

    /* First page load */
    if (obj.options.useEvents){
      window.dispatchEvent(new CustomEvent('page_load'));
    }
  };

  /* Initialize and/or return */
  if (obj.options.init === true){
    obj.init();
  }
  return obj;
}
