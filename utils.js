export const TRANSITION_END = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";

export const ANIMATION_END = "webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend";

export default {
  extend: function(object, properties) {
    let newObject = Object.create(object);
    for (let property in properties){
      newObject[property] = properties[property];
    }
    return newObject;
  },
}

export function validatePostalCode(postalCode) {
  return /[A-Z][0-9][A-Z]( )?[0-9][A-Z][0-9]/.test(postalCode.toUpperCase());
}

export function validateEmail(emailAddress) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)
}
