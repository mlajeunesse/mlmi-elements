$.fn.Select = function() {
  let self = this
  let $select = undefined
  let $selected = undefined
  let $options = undefined
  let $list = undefined
  let $items = undefined
  self.is_multiple = self.prop('multiple')

  if ($(this).data('$select')) {
    return self.data('$select')
  }

  self.initialize_markup = function() {
    // Wrap .select element
    self.removeClass('select')
    self.wrap('<div class="select"></div>')
    $select = self.parents('.select')

    // Multiple
    if (self.is_multiple) {
      $select.addClass('select--multiple')
    }

    // Add selected element
    $selected = $('<span class="select__selected" tabindex="0"></span>')
    if (self.is_multiple) {
      let multipleString = ''
      let multipleSelected = self.find("option:selected")
      multipleSelected.each(function(index) {
        multipleString += $(this).data('display') ? $(this).data('display') : $(this).text()
        if (index < multipleSelected.length - 2) {
          multipleString += ', '
        } else if (index == multipleSelected.length - 2) {
          multipleString += ' & '
        }
      })
      $selected.text(multipleString)
    } else {
      let selectedText = self.find('option:selected').data('display') ? self.find('option:selected').data('display') : self.find('option:selected').text()
      $selected.text(selectedText)
    }
    $select.prepend($selected)
    if (self.find('option:selected').val()) {
      $select.removeClass('select--empty')
    } else {
      $select.addClass('select--empty')
    }

    // Add options element
    $options = $('<div class="select__options"></div>')
    $list = $('<ul></ul>')
    $options.append($list)
    $selected.after($options)

    // Add options
    self.find('option').each(function() {
      if (!$(this).prop('disabled')) {
        let $option = $('<li tabindex="0"></li>')
        $option.text($(this).text())
        $option.data('value', $(this).val())
        if (self.is_multiple && $(this).prop('selected')) {
          $option.addClass('selected')
        }
        if ($(this).data('display')) {
          $option.data('display', $(this).data('display'))
        }
        if ($(this).val()) {
          $list.append($option)
        }
      }
    })

    // Option items
    $items = $list.find('li')
  }

  self.initialize_events = function() {
    $selected.on('click', function() {
      self.toggleSelect()
    })

    $items.on('click', function(e) {
      self.selectValue($(e.target))
    })

    $select.on('click', function(e) {
      if ($(e.target).parents('.select').length === 1) {
        e.stopPropagation()
        $('.select').not($select).removeClass('select--opened')
      }
    })

    $(document).on('click', function(e) {
      if ($(e.target).parents('.select').length === 0) {
        $('.select').each(function() {
          $(this).removeClass('select--opened')
        })
      }
    })
  }

  self.toggleSelect = function() {
    if ($select.hasClass('select--opened')) {
      $select.removeClass('select--opened')
      $selected.focus()
    } else {
      // close all opened elements
      $('select--opened').each(function() {
        $(this).blur().removeClass('select--opened')
      })

      // check if should be opened upward
      let distanceFromBottom = $(window).height() - ($select.offset().top - $(window).scrollTop() + $select.outerHeight())
      if ($options.outerHeight(false) > distanceFromBottom) {
        $select.addClass('select--upward')
      } else {
        $select.removeClass('select--upward')
      }

      // open and focus on current value item
      $select.addClass('select--opened')
      $items.each(function() {
        let $item = $(this)
        if (self.val() == $item.data('value')) {
          self.getSelectedItem().focus()
        }
      })
    }
  }

  self.getSelectedItem = function() {
    let $selectedItem = undefined
    $items.each(function() {
      let $item = $(this)
      if (self.val() == $item.data('value')) {
        $selectedItem = $item
      }
    })
    return $selectedItem
  }

  self.setValue = function(newValue) {
    self.val(newValue);
    self.change()
    let selectedText = self.find('option:selected').data('display') ? self.find('option:selected').data('display') : self.find('option:selected').text()
    $selected.text(selectedText)
  }

  self.selectValue = function(item) {
    const value = item.data('value')
    if (self.is_multiple) {
      let formerValues = self.val()
      if (formerValues.indexOf(value) !== -1) {
        formerValues.splice(formerValues.indexOf(value), 1)
        self.find('option[value="' + value + '"]').prop('selected', false)
      } else {
        self.find('option[value="' + value + '"]').prop('selected', true)
      }
    } else {
      self.find('option[value="' + value + '"]').prop('selected', true)
    }
    if (self.is_multiple) {
      let values = self.val()
      if (values == null || !values.length) {
        values = [""]
      }
      if (value == "none") {
        values = ["none"]
      } else {
        let emptyIndex = values.indexOf("")
        if (emptyIndex !== -1) {
          values.splice(emptyIndex, 1)
        }
        let noneIndex = values.indexOf("none")
        if (noneIndex !== -1) {
          values.splice(noneIndex, 1)
        }
      }
      if (!values.length) {
        values = [""]
      }
      self.val(values)
      $options.find('li').each(function() {
        if (values.indexOf($(this).data('value')) === -1) {
          $(this).removeClass('selected')
        } else {
          $(this).addClass('selected')
        }
      })
      if (values.length == 1 && values[0] == "") {
        $selected.text(self.find("option:first").text())
        $select.addClass('select--empty')
      } else {
        let multipleString = ''
        let multipleSelected = self.find("option:selected")
        multipleSelected.each(function(index) {
          multipleString += $(this).data('display') ? $(this).data('display') : $(this).text()
          if (index < multipleSelected.length - 2) {
            multipleString += ', '
          } else if (index == multipleSelected.length - 2) {
            multipleString += ' & '
          }
        })
        $selected.text(multipleString)
        $select.removeClass('select--empty')
      }
    } else {
      $select.removeClass('select--opened')
      let itemText = item.data('display') ? item.data('display') : item.text()
      $selected.text(itemText)
      if (value) {
        $select.removeClass('select--empty')
      } else {
        $select.addClass('select--empty')
      }
    }
    self.trigger('change')
  }

  self.initialize_keys = function() {
    /* Escape closes the dropdown */
    $select.find("*").on('keydown', function(e) {
      const key = e.keyCode || e.which

      if ([32, 37, 38, 39, 40].indexOf(key) > -1) {
        e.preventDefault()
      } else if (key == 27) {
        $select.removeClass('select--opened')
        $selected.focus()
      } else if (key == 9) {
        if ($select.hasClass('select--opened')) {
          e.preventDefault()
        }
      }
    })

    $selected.on('keyup', function(e) {
      const key = e.keyCode || e.which

      if (key == 13 || key == 32) {
        self.toggleSelect()
      } else if (key == 38 || key == 37) {
        if ($select.hasClass('select--opened')) {
          if ($select.hasClass('select--upward')) {
            $items.last().focus()
          }
        }
      } else if (key == 40 || key == 39) {
        if (!$select.hasClass('select--opened')) {
          self.toggleSelect()
        }
        if (!$select.hasClass('select--upward')) {
          $items.first().focus()
        }
      }
    })

    $items.on('keyup', function(e) {
      const key = e.keyCode || e.which
      const $item = $(e.target)

      if (key == 13 || key == 32 || key == 9) {
        e.preventDefault()
        self.selectValue($item)
        $selected.focus()
      } else if (key == 38 || key == 37) {
        if ($item.is(':first-child')) {
          if (!$select.hasClass('select--upward')) {
            $selected.focus()
          }
        } else {
          $item.prev().focus()
        }
      } else if (key == 40 || key == 39) {
        if ($item.is(':last-child')) {
          if ($select.hasClass('select--upward')) {
            $selected.focus()
          }
        } else {
          $item.next().focus()
        }
      }
    })
  }

  return function() {
    self.initialize_markup()
    self.initialize_events()
    self.initialize_keys()
    self.data('select', self)
    return self
  }()
}
