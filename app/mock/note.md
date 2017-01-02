```js
/*
PhantomJS
TypeError: '[object EventConstructor]' is not a constructor (evaluating 'new Event("readystatechange")')

https://github.com/bluerail/twitter-bootstrap-rails-confirm/issues/18
https://github.com/ariya/phantomjs/issues/11289
*/
try {
	new window.Event('custom')
} catch (exception) {
   window.Event = function(type, bubbles, cancelable, detail) {
        var event = document.createEvent('CustomEvent') // MUST be 'CustomEvent'
        event.initCustomEvent(type, bubbles, cancelable, detail)
        return event
    }
}
```

在mockjs目录里dist目录下的mock.js中找到上述代码, 并注释掉, 在android中会报document找不到的错误,
看注释这段代码是为了兼容PhantomJS使用的, 在react-native环境中并不需要使用.