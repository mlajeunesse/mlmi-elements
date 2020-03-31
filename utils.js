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

/* Validate postal code */
export function validatePostalCode(postalCode) {
  return /[A-Z][0-9][A-Z]( )?[0-9][A-Z][0-9]/.test(postalCode.toUpperCase());
}

/* Validate email address */
export function validateEmail(emailAddress) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)
}

/* Set cookie */
function setCookie(cookie_name, cookie_value, seconds) {
  let cookieTime = new Date();
  cookieTime.setTime(currentTime.getTime() + (seconds * 1000));
  document.cookie = cookie_name + "=" + cookie_value + ";" + "expires=" + cookieTime.toUTCString() + ";path=/";
}

/* Read cookie */
function getCookie(cookie_name) {
  let name = cookie_name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/* Read GET parameter */
function getParameter(parameterName) {
  let result = false, tmp = [];
  let items = location.search.substr(1).split("&");
  for (let index = 0; index < items.length; index++) {
    tmp = items[index].split("=");
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  }
  return result;
}
