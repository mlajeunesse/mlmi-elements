import Swiper, { Navigation, Pagination } from 'swiper'
import Mobile from './mobile';

Swiper.use([Navigation, Pagination]);

export default function(element, swiper_options, options) {
  let self = $(element)
  self.mobile = new Mobile()
  self.swiper = undefined
  self.wrapper = self.find('.swiper-wrapper')
  self.slides = self.find('.swiper-slide')

  if (options == undefined) {
    options = {}
  }

  options = $.extend(true, {
    mobile: true,
    desktop: true,
    groupItems: {
      slidesPerGroup: {
        mobile: false,
        desktop: false,
      },
      wrapperClass: 'slides-group',
    },
    forceRebuild: false,
    onInit: undefined,
    onKill: undefined,
  }, options)

  swiper_options = $.extend({
    threshold: 15,
    resistanceRatio: 0.25,
  }, swiper_options)

  self.initialize = function() {
    self.wrapper.addClass('swiper-wrapper')
    self.slides.addClass('swiper-slide')
    if (options.groupItems && self.getSlidesPerGroup()) {
      while (self.find('.swiper-wrapper > .swiper-slide').length > 0) {
        self.find('.swiper-wrapper > .swiper-slide:lt(' + self.getSlidesPerGroup() + ')').wrapAll($('<div class="' + options.groupItems.wrapperClass + '">'))
      }
      self.slides.removeClass('swiper-slide')
      $('.' + options.groupItems.wrapperClass).addClass('swiper-slide')
    }
    self.swiper = new Swiper(element, swiper_options)
    if (options.onInit != undefined) {
      options.onInit(self)
    }
  }

  self.kill = function() {
    if (self.wrapper.length) {
      self.wrapper.removeClass('swiper-wrapper')
    }
    if (self.slides.length) {
      self.slides.removeClass('swiper-slide')
    }
    if (self.swiper != undefined) {
      self.swiper.destroy()
      self.swiper = undefined
    }
    if (options.groupItems) {
      if (self.find('.' + options.groupItems.wrapperClass).length) {
        self.slides.unwrap('.' + options.groupItems.wrapperClass)
      }
    }
    if (options.onKill != undefined) {
      options.onKill(self)
    }
  }

  self.toggle_mobile = function() {
    if (self.swiper != undefined && options.forceRebuild) {
      self.kill()
    }
    if (self.swiper == undefined && options.mobile) {
      self.initialize()
    } else if (!options.mobile) {
      self.kill()
    }
  }

  self.toggle_desktop = function() {
    if (self.swiper != undefined && options.forceRebuild) {
      self.kill()
    }
    if (self.swiper == undefined && options.desktop) {
      self.initialize()
    } else if (!options.desktop) {
      self.kill()
    }
  }

  self.getSlidesPerGroup = function() {
    if (options.groupItems && options.groupItems.slidesPerGroup) {
      if (typeof options.groupItems.slidesPerGroup === 'number') {
        return options.groupItems.slidesPerGroup
      } else if (self.mobile.isMobile) {
        return options.groupItems.slidesPerGroup.mobile ? options.groupItems.slidesPerGroup.mobile : false
      } else {
        return options.groupItems.slidesPerGroup.desktop ? options.groupItems.slidesPerGroup.desktop : false
      }
    }
    return false
  }

  self.init = function() {
    self.mobile.addCallbacks(self.toggle_mobile, self.toggle_desktop)
  }
  return self
}
