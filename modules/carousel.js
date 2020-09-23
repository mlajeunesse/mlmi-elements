import Swiper from 'swiper/js/swiper';
import Mobile from './mobile';

export default function(element, swiper_options, options) {
  let self = $(this)
  self.swiper = undefined
  self.wrapper = self.find('.swiper-wrapper')
  self.slides = self.find('.swiper-slide')

  if (options == undefined) {
    options = {}
  }

  options = $.extend({
    mobile: true,
    desktop: true,
    onInit: undefined,
    onKill: undefined,
  }, options)

  self.initialize = function() {
    self.wrapper.addClass('swiper-wrapper')
    self.slides.addClass('swiper-slide')
    self.swiper = new Swiper(element, swiper_options)
    if (options.onInit != undefined) {
      options.onInit(self)
    }
  }

  self.kill = function() {
    self.wrapper.removeClass('swiper-wrapper')
    self.slides.removeClass('swiper-slide')
    self.swiper.destroy()
    self.swiper = undefined
    if (options.onKill != undefined) {
      options.onKill(self)
    }
  }

  self.toggle_mobile = function() {
    if (self.swiper == undefined && options.mobile) {
      self.initialize()
    } else if (self.swiper != undefined && !options.mobile) {
      self.kill()
    }
  }

  self.toggle_desktop = function() {
    if (self.swiper == undefined && options.desktop) {
      self.initialize()
    } else if (self.swiper != undefined && !options.desktop) {
      self.kill()
    }
  }

  self.init = function() {
    let mobileChecker = new Mobile()
    mobileChecker.addCallbacks(self.toggle_mobile, self.toggle_desktop)
  }
  return self
}
