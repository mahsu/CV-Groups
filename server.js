var express = require('express');
var bodyParser = require('body-parser');
var log = require('./logger.js');
var config = require('./config.js');
var app = express();
var __dirname = "data";
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.use(bodyParser.json());

// Auth Middleware 
//
app.use('/pdfdata', express.static(__dirname));
app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function(err, req, res, next) {
  if(err)
  {
		log.error(err);
		res.send(err);
  }
  else 
  {	
	var err = new Error('Not Found');
	err.status = 404;
	next(err); 
  }
});
 
// Start the server on Port
app.set('port', config.port);
 
var server = app.listen(app.get('port'), function() {
  log.info('Express server listening on port ' + server.address().port);
});