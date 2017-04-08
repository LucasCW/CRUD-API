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
mongoose.set('debug', true);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected');
});

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

router.route('/bears').post(function(req, res) {
	var bear = new Bear();
	bear.name = req.body.name;
	console.log(bear);
	console.log(bear.save);
	bear.save(function(err, bear) {
		console.log('what the fuck');
		if(err)
			res.send(err);

		res.json({message: 'Bear created'});
	});
}).get(function(req, res) {
	Bear.find(function(err, bears) {
		// console.log('what the fuck');
		if(err)
			res.send(err);
		res.json(bears);
	});
});

router.route('/bears/:bear_id')
	.get(function (req, res) {
		Bear.findById(req.params.bear_id, function (err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})
	.put(function (req, res) {
		Bear.findById(req.params.bear_id, function (err, bear) {
			if (err)
				res.send(err);
			bear.name = req.body.name;

			bear.save(function (err) {
				if(err)
					res.send(err);
				res.json({ message: 'Bear updated!' });
			});
		});
	})
	.delete(function (req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);
			res.json({ message: 'Successfully deleted' });
		});
	});


// Register routes
app.use('/api', router);


// Start the server
app.listen(port);

console.log('Magic happends on port ' + port);