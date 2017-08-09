var express = require('express');
var bodyParser = require('body-parser');
var searchController = require('./search/searchController');
var massive = require('massive');
var secret = require('./secret');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res, next) {
	return res.status(200).send('this would be the homepage');
});

app.get('/api', searchController.search);

app.get('/latest', function(req, res, next) {
	return res.status(200).send('latest');
});

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
