var connect = require('connect');
var forward = require('../');
var request = require('supertest');

var app = connect();

app.use('/favicon.ico', forward(__dirname + '/assets/favicon.ico'));
app.use('/test.ico', forward(__dirname + '/assets/inexist.ico'));
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
