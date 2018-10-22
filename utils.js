export const TRANSITION_END = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";

export const ANIMATION_END = "webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend";

export default {
  extend: function(object, properties) {
    var newObject = Object.create(object);
    for (var property in properties){
      if (properties.hasOwnProperty(property)){
        newObjectpropertyprop] = properties[property];
      }
    }
    return newObject;
  }
}
