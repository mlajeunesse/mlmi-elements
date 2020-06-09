import { TRANSITION_END } from '../utils'

$.fn.Form = function(obj) {
  let self = this
  if (self.data('form')) {
    return self
  }
  self.action = self.find('input[name="action"]').val()
  self.fields = {}
  self.el = {
    inputs: self.find(':input'),
    fields: self.find('.field'),
    submit: self.find('[type="submit"]'),
  }

  self.get_form_data = function() {
    let data = {}
    for (let fieldName in self.fields) {
      data[fieldName] = self.get_form_value(fieldName)
    }
    return data
  }

  self.get_form_value = function(fieldName) {
    let field = self.fields[fieldName]
    if (field.attr('type') == 'number') {
      return parseInt(field.val(), 10)
    }
    return field.val()
  }

  self.handle_submit = function(e) {
    e.preventDefault()
    self.el.fields.addClass('field--disabled')
    self.el.submit.prop('disabled', true)
    self.el.inputs.prop('disabled', true)
    $('.field--invalid').removeClass('field--invalid')
    $('.field__error').on(TRANSITION_END, function() {
      $(this).remove()
    }).addClass('field__error--remove')
    $.post(obj.options.ajax_url, self.get_form_data(), self.handle_response, 'json')
  }

  self.handle_response = function(response) {
    if (response.success) {
      self.handle_success(response)
    } else {
      self.handle_error(response)
    }
  }

  self.handle_success = function(response) {
    if (obj.options.ajax_redirect && response.redirect) {
      location.href = response.redirect
    }
  }

  self.handle_error = function(response) {
    self.el.fields.removeClass('field--disabled')
    self.el.inputs.prop('disabled', false)
    self.el.submit.prop('disabled', false)
    for (let fieldName in response.errors) {
      let input = self.fields[fieldName],
      field = $(input).parents('.field').addClass('field--invalid')
      field.after($(response.errors[fieldName]))
    }
    if (obj.options.auto_scroll) {
      let windowTarget = $('.form-error, .field--invalid').offset().top - obj.options.auto_scroll_offset
      if ($(window).scrollTop() > windowTarget) {
        $('html, body').animate({
          scrollTop: windowTarget + 'px',
        }, 450)
      }
    }
  }

  return function() {
    self.el.inputs.each(function() {
      if ($(this).attr('name')) {
        self.fields[$(this).attr('name')] = $(this)
      }
    })
    if (obj.options.use_ajax) {
      self.on('submit', self.handle_submit)
    }
    self.data('form', self)
    return self
  }()
}

export default function (selector, options) {
  let obj = this
  obj.forms = []

  /*
  * Default options
  */
  if (selector == undefined) {
    selector = 'form'
  }
  if (options == undefined) {
    options = {}
  }
  obj.options = $.extend({
    use_ajax: true,
    ajax_url: '/wp/wp-admin/admin-ajax.php',
    ajax_redirect: true,
    fields_selector: ':input',
    auto_scroll: true,
    auto_scroll_offset: 30,
  }, options)

  /*
  * Initializer
  */
  $(selector).each(function() {
    let form = $(this).Form(obj)
    obj.forms.push(form)
  })

  return obj
}
