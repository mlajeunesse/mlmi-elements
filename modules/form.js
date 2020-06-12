import '../plugins/select'
import DatePickerFactory from 'jquery-datepicker'
import DatePickerFactoryFR from 'jquery-datepicker/i18n/jquery.ui.datepicker-fr'

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
    if (Array.isArray(field)) {
      let values = []
      field.forEach(function(element) {
        if (element.attr('type') == 'radio' && element.prop('checked')) {
          values = element.val()
        } else if (element.attr('type') == 'checkbox' && element.prop('checked')) {
          values.push(element.val)
        }
      })
      return values
    } else if (field.attr('type') == 'number') {
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
    $('.field-error, .form-error').remove()
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
    if (response.error != undefined) {
      self.prepend($(response.error))
    }
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
      if ($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox') {
        if (self.fields[$(this).attr('name')] == undefined) {
          self.fields[$(this).attr('name')] = []
        }
        self.fields[$(this).attr('name')].push($(this))
      } else if ($(this).attr('name')) {
        self.fields[$(this).attr('name')] = $(this)
      }
    })
    if (obj.options.use_ajax) {
      self.on('submit', self.handle_submit)
    }
    if (obj.options.select_element) {
      self.find('.field select').each(function() {
        $(this).Select()
      })
    }
    if (obj.options.date_picker) {
      obj.options.date_picker = $.extend({
        dateFormat: "yy-mm-dd",
        nextText: '▶',
        prevText: '◀',
      }, obj.options.date_picker)
      DatePickerFactory($)
      $('.field--type-date_picker input').each(function() {
        $(this).datepicker(obj.options.date_picker)
        if (obj.options.locale == 'fr') {
          DatePickerFactoryFR($)
          $.datepicker.regional['fr']
        }
      })
    }
    self.data('form', self)
    return self
  }()
}

export default function (selector, options) {
  let obj = this
  obj.form = undefined

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
    locale: 'fr',
    use_ajax: true,
    ajax_url: '/wp/wp-admin/admin-ajax.php',
    ajax_redirect: true,
    fields_selector: ':input',
    auto_scroll: true,
    auto_scroll_offset: 30,
    select_element: true,
    date_picker: false,
  }, options)

  /*
  * Initializer
  */
  $(selector).each(function() {
    obj.form = $(this).Form(obj)
  })

  obj.getForm = function() {
    return obj.form
  }

  return obj
}
