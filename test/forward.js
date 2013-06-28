var connect = require('connect');
var forward = require('../');
var request = require('supertest');
var pedding = require('pedding');

var app = connect();

app.use('/favicon.ico', forward(__dirname + '/assets/favicon.ico'));
app.use('/test.ico', forward(__dirname + '/assets/inexist.ico'));
app.use('/humans.txt', forward(__dirname + '/assets/humans.txt', {charset: 'utf-8'}));

app.use(function (req, res) {
  res.end(JSON.stringify({"echo": "default handle"}));
});

describe('forward', function () {
  before(function (done) {
    app.listen(0, done);
  });

  it('should forward to /assets/favicon.ico', function (done) {
    request(app)
    .get('/favicon.ico')
    .expect(200)
    .expect('Content-Type', 'image/x-icon', done);
  });

  it('should GET /humans.txt forward to /assets/humans.txt with charset', function (done) {
    done = pedding(2, done);

    request(app)
    .get('/humans.txt')
    .expect(200)
    .expect('Etag', '"0f83dda66a51dd284306eecfa6d9856d"')
    .expect('Content-Length', '84')
    .expect('Cache-Control', 'public, max-age=86400')
    .expect('Content-Type', 'text/plain; charset=utf-8', function (err) {
      done(err);

      // from cache
      request(app)
      .get('/humans.txt')
      .expect(200)
      .expect('Etag', '"0f83dda66a51dd284306eecfa6d9856d"')
      .expect('Content-Length', '84')
      .expect('Cache-Control', 'public, max-age=86400')
      .expect('Content-Type', 'text/plain; charset=utf-8', done);
    });
  });

  it('should forward to err', function (done) {
    request(app)
    .get('/test.ico')
    .expect(404)
    .expect('Content-Type', 'text/plain', done);
  });

  it('should default handled', function(done){
    request(app)
    .get('/hehe')
    .expect(200)
    .expect('{"echo":"default handle"}', done);
  });
});
