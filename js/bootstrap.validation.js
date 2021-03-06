/**
 *  desctiption	:	基于jQuery和bootstrap封装的对bootstrap表单验证插件
 *	author 		：   laizuan
 *	date   		:   2017-07-17
 *	version		:   1.0
 *	1、使用	
 *		1.1：在需要验证的文本框中加入validation属性，其值就是验证的规则。可以为默认的规则或者自定义规则,当前为您准备了如下几个规则：
 *          username:验证用户名，只能输入5-20个以字母开头、可带数字的字串
 *			mobile:验证手机号码
 * 			eamil :验证邮箱地址
 *          password:验证密码只能输入6-20 位，字母、数字、字符
 *          number：验证非0正整数
 *          license：验证车牌号码
 *          phone：验证电话号码（座机）
 *			例如：
 *				validation=mobile就可以为您校验用户输入的是否是手机号码了，是否很方便？
 *		1.2：当然你也可以自定义validation的值，它的值就数据校验的正则表达式,需要注意的是如果您选择的是使用自己的正则表达式的话不要包含正则的开始和结束符号，即//两个斜杠
 *		1.3：什么？您想自定义错误信息。当然有，只要您在校验框中加入message属性，它的值就是您想要的消息了
 *		1.4：有时候你可能不强制填写，但是又需要校验用户输入的是否符合规范。这时候我们为您准备了isEmpty这个属性。也就是说当isEmpty的值为true的时候我们只为您校验值得规范
 *		1.5:还不知道怎么用？别急。只需要你提交事件中加上一行代码就行了，$(form对象).validation(); 是不是很简单
 *
 *	2、依赖
 *		jQuery.js
 *		bootstrap.css
 *
 *	3、属性
 *		3.1、successStyle 是否显示验证成功的特效，true 显示 false不显示 。 默认是false
 *		3.2、showTip 验证不通过的时候是否显示tip效果，true 显示 false不显示。  默认是true
 *      3.3、tipTimeout 是否主动关闭提示语，如果设置成0 表示不关闭，大于0表示多少秒之后关闭。默认为0
 *      3.4、callback 回调函数，带两个参数，第一个是表单是否全部验证通过，通过返回true，不通过返回false。第二个参数为当前form表单对象，当然这个插件本身也返回了这个这个form表单对象，您依然可以继续链式调用
 *      3.5、warning 是否显示错误警告，true 显示 false不显示。  默认是true。提示宽度基于form表单的宽度计算
 *
 **/
(function($) {
	"use strict";

	var validationParams = {
		username: /^[a-zA-Z]{1}([a-zA-Z0-9]){4,19}$/,
		mobile: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/,
		email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
		password: /^(\w){6,20}$/,
		number: /^[1-9]*[1-9][0-9]*$/,
		license: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
		phone: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
	};

	$.fn.validation = function(options, methods) {
		var defales = {
			successStyle: false,
			showTip: true,
			warning: true,
			tipTimeout: 0,
			callback: $.fun
		};
		var _option = $.extend(defales, options);
		var $this = $(this);
		var $inputs = $this.find('input[validation]');
		var success = [];
		try {
			$inputs.each(function(i, input) {
				var _this = $(input);
				success[i] = channle(_this, _option);
			});
		} catch(e) {
			alert(e.message);
			return false;
		}
		var yes = true;
		var count = 0;
		$.each(success,
		function(i, value) {
			if (!value) {
				yes = false;
				count++;
			}
		});
		if (_option.warning && count > 0) {
			var _iconThis = $this.find("#validationWarning");
			if (_iconThis) {
				closeWarning(_iconThis);
			}
			var _html = '<div class="alert alert-warning">';
			_html += '<a href="#" class="close" id="validationWarning">&times;</a>';
			_html += '<strong>警告！</strong>总共有 ' + count + ' 处错误。</div>';
			$this.prepend(_html);
			_iconThis = $this.find("#validationWarning");
			bindCloseWarning(_iconThis);
		} else {
			var _iconThis = $this.find("#validationWarning");
			if (_iconThis) {
				closeWarning(_iconThis);
			}
		}
		if (typeof _option.callback === 'function') {
			_option.callback(yes, $this);
		}

		return $this;
	}

	function channle(_inputThis, _option) {
		var _success = true;
		var _isEmpty = _inputThis.attr('isEmpty') || false;
		var _inputValue = _inputThis.val();
		if (_isEmpty === 'true') {
			if (_inputValue) {
				_success = validation(_inputThis, _option);
			}
		} else {
			if (_inputValue) {
				_success = validation(_inputThis, _option);
			} else {
				createError(_inputThis, _option);
				_success = false;
			}
		}
		return _success;
	}

	function validation(_inputThis, _opt) {
		var _type = _inputThis.attr('validation') || '';
		var _regular = validationParams[_type] || _type;

		var _reg = new RegExp(_regular);
		var _success = false;
		var _val = _inputThis.val();
		if (_reg.test(_val)) {
			if (_opt.successStyle) {
				createSuccess(_inputThis);
			}
			_success = true;
		} else {
			createError(_inputThis, _opt);
		}
		return _success;
	}

	function createSuccess(t) {
		var _html = '<span class="glyphicon glyphicon-ok form-control-feedback"></span>';
		var _style = 'has-success has-feedback';
		var _parentDvis = t.parents('div');
        _parentDvis.each(function() {
			var _css = $(this).attr('class');
			if (_css && _css.indexOf('form-group') >= 0) {
				$(this).addClass(_style);
			}
		});
		t.after(_html);
	}
    
	function createError(t, opt) {
		var _html = '<span class="glyphicon glyphicon-remove form-control-feedback"></span>';
		var _style = 'has-error has-feedback';
		var _parentDvis = t.parents('div');
        _parentDvis.each(function() {
			var $this = $(this);
			var _css = $this.attr('class');
			if (_css && _css.indexOf('form-group') >= 0) {
				$this.addClass(_style);
			}
		});
		t.after(_html);
		if (opt.showTip) {
			createTip(t, opt);
		}
		bindFunction(t, opt)
	}

	function removeErrorStyle(_inputThis) {
		var _span = _inputThis.nextAll('span');
		_span.each(function() {
			var $this = $(this);
			var _spanClass = $this.attr('class');
			if (_spanClass && _spanClass.indexOf('glyphicon-remove') >= 0) {
				$this.remove();
			}
		});

		var _style = 'has-error has-feedback';
		var _parentDvis = _inputThis.parents('div');
        _parentDvis.each(function() {
			var $this = $(this);
			var _css = $this.attr('class');
			if (_css && _css.indexOf('form-group') >= 0) {
				$this.removeClass(_style);
			}
		});
	}

	function createTip(_inputThis, _opt) {

		var _toolTipId = _inputThis.attr("aria-describedby");
		if (_toolTipId) {
			$('#' + _toolTipId).css('display', 'block');
			return;
		}

		var _width = _inputThis.width() / 2;
		var _height = _inputThis.height();
		var $inputParentThis = _inputThis.parent('div');
		var _inputParent = $inputParentThis.attr('class');
        if (_inputParent && _inputParent.indexOf('col-') >= 0) {
			_height = $inputParentThis.height();
		}

		var _id = 'tooltip' + Math.floor(Math.random() * 10000 + 1);
        var _message = _inputThis.attr('message') || '请填写有效数据';
		var _html = '<div class="tooltip fade top in" role="tooltip" id="' + _id + '" style="width: ' + _width + '; top: -' + _height + 'px; left: ' + _width + 'px; display: block;">';
		_html += '<div class="tooltip-arrow" style="left: 50%;"></div>';
		_html += '<div class="tooltip-inner">' + _message + '</div></div>';

		_inputThis.attr('aria-describedby', _id);
		_inputThis.after(_html);

		if (_opt.tipTimeout > 0) {
			setTimeout(function() {
				removeTip(_inputThis);
			},
			_opt.tipTimeout * 1000);
		}
	}

	function removeTip(_inputThis) {
		var _toolTipId = _inputThis.attr("aria-describedby");
		if (_toolTipId) {
			$('#' + _toolTipId).css('display', 'none');
		}
	}

	function bindFunction(_inputThis, _option) {
		_inputThis.bind({
			focus: function() {
				removeTip(_inputThis);
				removeErrorStyle(_inputThis);
			},
			blur: function() {
				channle(_inputThis, _option);
			}
		});
	}
    
	function closeWarning(_iconThis) {
		_iconThis.parent('div').remove();
	}
    
	function bindCloseWarning(t) {
		t.bind({
			click: function() {
				closeWarning(t);
			}
		})
	}
})(jQuery);
