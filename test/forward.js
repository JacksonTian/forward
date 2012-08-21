var connect = require('connect');
var forward = require('../');

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
    app.request()
    .get('/favicon.ico')
    .end(function(res){
      res.should.header('Content-Type', 'image/x-icon');
      res.statusCode.should.be.equal(200);
      done();
    });
  });

  it('should forward to err', function (done) {
    app.request()
    .get('/test.ico')
    .end(function(res){
      res.should.header('Content-Type', 'text/plain');
      res.statusCode.should.be.equal(404);
      done();
    });
  });

  it('should default handled', function(done){
    app.request()
    .get('/hehe')
    .end(function(res){
      res.statusCode.should.be.equal(200);
      res.body.toString().should.equal('{"echo":"default handle"}');
      done();
    });
  });
});
