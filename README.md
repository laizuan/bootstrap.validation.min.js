## bootstrap.validation.min.js 是基于jQuery之上开发的表单验证插件，它使用了bootstrap样式，所以它是响应式的

 [在线体验demo](https://laizuan.github.io/bootstrap.validation.min.js/demo.html) 
 
这个是我的第一个jQuery插件，以学习为目的的写了这个插件。一个后端猿人对js和jQuery并不是很懂，有很多不完善的地方请各路大神多多指点。有喜欢的还望点个Star
```

--------------------------------------------------华丽的分割线--------------------------------------------------

    desctiption	:	基于jQuery和bootstrap封装的对bootstrap表单验证插件
  	author 		：   laizuan
  	date   		:   2017-07-17
  	version		:   1.0
    
    
    
  	1、使用	
  		1.1：在需要验证的文本框中加入validation属性，其值就是验证的规则。可以为默认的规则或者自定义规则。
        当前为您准备了如下几个规则：
            username:验证用户名，只能输入5-20个以字母开头、可带数字的字串
  			mobile:验证手机号码
 			eamil :验证邮箱地址
            password:验证密码只能输入6-20 位，字母、数字、字符
            number：验证非0正整数
            license：验证车牌号码
            phone：验证电话号码（座机）
  			例如：
  				validation=mobile就可以为您校验用户输入的是否是手机号码了，是否很方便？
                
  		1.2：当然你也可以自定义validation的值，它的值就数据校验的正则表达式,
            需要注意的是如果您选择的是使用自己的正则表达式的话不要包含正则的开始和结束符号，即//两个斜杠
            
  		1.3：什么？您想自定义错误信息。当然有，只要您在校验框中加入message属性，它的值就是您想要的消息了
        
  		1.4：有时候你可能不强制填写，但是又需要校验用户输入的是否符合规范。这时候我们为您准备了isEmpty这个属性。
            也就是说当isEmpty的值为true的时候我们只为您校验值得规范
            
  		1.5:还不知道怎么用？别急。只需要你提交事件中加上一行代码就行了，$(form对象).validation(); 是不是很简单
        
        
  
  	2、依赖
  		jQuery.js
  		bootstrap.css
        
        
  
  	3、属性
  		3.1、successStyle 是否显示验证成功的特效，true 显示 false不显示 。 默认是false
        
  		3.2、showTip 验证不通过的时候是否显示tip效果，true 显示 false不显示。  默认是true
        
        3.3、tipTimeout 是否主动关闭提示语，如果设置成0 表示不关闭，大于0表示多少秒之后关闭。默认为0
      
        3.4、callback 回调函数，带两个参数，第一个是表单是否全部验证通过，通过返回true，不通过返回false。
            第二个参数为当前form表单对象，当然这个插件本身也返回了这个这个form表单对象，您依然可以继续链式调用
            
        3.5、warning 是否显示错误警告，true 显示 false不显示。  默认是true。提示宽度基于form表单的宽度计算
