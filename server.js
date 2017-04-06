// Base setup
var express = require('express');
var app 	= express();
var bodyParser = require('body-parser');
var Bear = require('./app/models/bear');


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bear');

// Routes for our api
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log('Something is happening');
	next();
});


router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});


// Register routes
app.use('/api', router);


// Start the server
app.listen(port);

console.log('Magic happends on port ' + port);