
/*!
 * Connect - favicon
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs');
var mime = require('mime');
var utils = require('connect').utils;

/**
 * Foward the request to a special path.
 *
 * Options:
 *
 *   - `maxAge`  cache-control max-age directive, defaulting to 1 day
 *
 * Examples:
 *  var app = connect();
 *  app.use('/favicon.ico', forward(__dirname + '/assets/favicon.ico'));
 *
 * @param {String} path
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function (path, options) {
  var cache = null;
  options = options || {};
  var maxAge = options.maxAge || 86400000;

  return function (req, res, next) {
    if (cache) {
      res.writeHead(200, cache.headers);
      res.end(cache.body);
    } else {
      fs.readFile(path, function (err, buf) {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end();
          return;
        }
        cache = {
          headers: {
              'Content-Type': mime.lookup(path),
              'Content-Length': buf.length,
              'ETag': '"' + utils.md5(buf) + '"',
              'Cache-Control': 'public, max-age=' + (maxAge / 1000)
          },
          body: buf
        };
        res.writeHead(200, cache.headers);
        res.end(cache.body);
      });
    }
  };
};
