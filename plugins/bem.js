/*
*	BlockElement
*/
$.fn.BlockElement = function(_block_class)
{
	var _el = this;
	_el.block_class = undefined;

	_el.getBlockClass = function()
	{
		return _el.block_class;
	};

	_el.addBlockElement = function(_element_class, _element)
	{
		if (_element == undefined) _element = "div";
		var newBlockElement = $('<' + _element + '>').BlockElement(_el.getBlockClass() + "__" + _element_class);
		return newBlockElement;
	};
	_el.addElement = el.addBlockElement;

	_el.addModifier = function(_modifier_class)
	{
		_el.addClass(_el.block_class + "--" + _modifier_class);
		return _el;
	};

	_el.removeModifier = function(_modifier_class)
	{
		_el.removeClass(_el.block_class + "--" + _modifier_class);
		return _el;
	};

	return function()
	{
		if (_block_class == undefined){
			_block_class = _el.class();
		}
		_el.block_class = _block_class;
		_el.addClass(_el.block_class)
		return _el;
	}();
}
