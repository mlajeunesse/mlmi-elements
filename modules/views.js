import Utils from '../utils'

export default {
  views: [],
  namespace: 'global',
  navigation: undefined,

  onPageLoad: function() {
    let namespace = $(this.navigation.options.selectors.pageTarget).data('namespace');
    if (namespace == undefined) namespace = "global";
    this.views.forEach(function(view){
      if (view.namespace === namespace){
        if (view.hasOwnProperty('onEnterGlobal') && typeof view.onEnterGlobal === 'function'){
          view.onEnterGlobal();
        }
        if (view.hasOwnProperty('onEnter') && typeof view.onEnter === 'function'){
          view.onEnter();
        }
      }
    });
  },

  onPageExit: function() {
    let namespace = $(this.navigation.options.selectors.pageContent).data('namespace');
    if (namespace == undefined) namespace = "global";
    this.views.forEach(function(view){
      if (view.namespace === namespace){
        if (view.hasOwnProperty('onLeave') && typeof view.onLeave === 'function'){
          view.onLeave();
        }
        if (view.hasOwnProperty('onLeaveGlobal') && typeof view.onLeaveGlobal === 'function'){
          view.onLeaveGlobal();
        }
      }
    });
  },

  extend: function(globalView, pageView) {
    let view = Object.assign( Object.create( Object.getPrototypeOf(globalView)), globalView)
    if (view.hasOwnProperty('onEnter') && typeof view.onEnter === 'function'){
      view.onEnterGlobal = view.onEnter;
      delete view.onEnter;
    }
    if (view.hasOwnProperty('onLeave') && typeof view.onLeave === 'function'){
      view.onLeaveGlobal = view.onLeave;
      delete view.onLeave;
    }
    for (var property in pageView){
      if (pageView.hasOwnProperty(property)){
        view[property] = pageView[property];
      }
    }
    return view;
  },

  init: function(navigation, views) {
    let self = this;
    this.views = views;
    this.navigation = navigation;
    $(window).on('page_load', function(){
      self.onPageLoad();
    });
    $(window).on('page_exit', function(){
      self.onPageExit();
    });
  },
}
