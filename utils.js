export const TRANSITION_END = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend"
export const ANIMATION_END = "webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend"

/* Use with caution */
export const IS_IOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
export const IS_ANDROID = /(android)/i.test(navigator.userAgent)

export default {
  extend: function(object, properties) {
    let newObject = Object.create(object)
    for (let property in properties){
      newObject[property] = properties[property]
    }
    return newObject
  },
}

/* Validate postal code */
export function validatePostalCode(postalCode) {
  return /[A-Z][0-9][A-Z]( )?[0-9][A-Z][0-9]/.test(postalCode.toUpperCase())
}

/* Validate email address */
export function validateEmail(emailAddress) {
  return /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)
}

/* Set cookie */
export function setCookie(cookie_name, cookie_value, seconds) {
  let cookieTime = new Date()
  cookieTime.setTime(cookieTime.getTime() + (seconds * 1000))
  document.cookie = cookie_name + "=" + cookie_value + ";" + "expires=" + cookieTime.toUTCString() + ";path=/"
}

/* Read cookie */
export function getCookie(cookie_name) {
  let name = cookie_name + "="
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

/* Read GET parameter */
export function getParameter(parameterName) {
  let result = false, tmp = []
  let items = location.search.substr(1).split("&")
  for (let index = 0; index < items.length; index++) {
    tmp = items[index].split("=")
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
  }
  return result
}

export function formatDate(date) {
  let d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

export let decodeEntities = (function() {
  let element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }
    return str;
  }
  return decodeHTMLEntities;
})();
