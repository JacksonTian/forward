
/*!
 * forward - lib/forward.js
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs');
var crypto = require('crypto');
var mime = require('mime');

var md5 = function(str, encoding){
  return crypto
    .createHash('md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
};

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
 *  app.use('/humans.txt', forward(__dirname + '/assets/humans.txt', {charset: 'utf-8'}));
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
  var contentType = options.mime || mime.lookup(path);
  var charset = options.charset ? '; charset=' + options.charset : '';

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
            'Content-Type': contentType + charset,
            'Content-Length': buf.length,
            'ETag': '"' + md5(buf) + '"',
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
