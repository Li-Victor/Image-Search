var express = require('express');
var bodyParser = require('body-parser');
var searchController = require('./search/searchController');
var massive = require('massive');
var secret = require('./secret');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//middleware for static pages
app.use('/', express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
	return res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/:text', searchController.search);

app.get('/latest', searchController.latest);

app.all('*', function(req, res, next) {
	return res.status(404).send({
		error: 'There has been an error with your search. Please follow the instructions on http://localhost:3000'
	});
});

var port = 3000;

massive(secret.DBconnection)
	.then(db => {
		app.set('db', db);

		app.listen(port, function() {
			console.log('Listening on port ' + port);
		});
	});
