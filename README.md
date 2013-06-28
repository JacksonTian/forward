Forward [![Build Status](https://secure.travis-ci.org/JacksonTian/forward.png?branch=master)](http://travis-ci.org/JacksonTian/forward) [![Coverage Status](https://coveralls.io/repos/JacksonTian/forward/badge.png)](https://coveralls.io/r/JacksonTian/forward)
====

# 起源
为了提高静态文件的性能，我们的站点做了为静态文件的路由添加前缀的工作。具体测试数据和原委请参加苏千的这篇文章：[给 connect 的 static 模块加上url路径前缀](http://cnodejs.org/topic/4fce14e0e5e72c25180b51d1)。其收效是明显的。

但是我们无法避免掉一些过去形成的习惯和约定，比如浏览器会访问`/favicon.ico`来读取网站默认图标，网络蜘蛛来读取`/robots.txt`来查询搜索引擎约定，等等。此类事情我们无法响应`301`转向使得每个客户端都能遵循转向获取实际的文件。所以我们需要`forward`的功能。

在Java的Servlet中，`redirect`是实际的`301`转向，`forward`是服务器端业务逻辑的转向。这里模块的名字选择采用`forward`来表示其意义。

# 用法
## 安装
```
npm install forward
```

## 调用
`forward`是一个`connect`中间件。调用时如下即可：

```
var app = connect();
app.use('/favicon.ico', forward(__dirname + '/assets/favicon.ico'));
app.use('/robots.txt', forward(__dirname + '/assets/robots.txt', {charset: 'utf-8'}));
```

# 许可证
在最为宽松的MIT许可下开源

```
Copyright (c) 2012 Jackson Tian
http://weibo.com/shyvo

The MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```