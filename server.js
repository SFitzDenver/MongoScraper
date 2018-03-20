// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var axios = require("axios");

var db = require("./models");

// Initialize Express
var app = express();

var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// Set up a static folder (public) for our web app
app.use(express.static("public"));

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";
// let uri = 'mongodb://<dbuser>:<dbpassword>@ds117509.mlab.com:17509/heroku_f6rh85v6';

// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, {
// 	useMongoClient: true
// });

mongoose.connect("mongodb://heroku_f6rh85v6:8e793mu8nhkiltpt1rancf526u@ds117509.mlab.com:17509/heroku_f6rh85v6");
//mongoose.connect("mongodb://localhost/mongoscraper");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// mongoose.connect("mongodb://localhost/news", {
//   useMongoClient: true
// });

// Routes

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public.index.html"));
});


app.get("/saved", function(req, res) {
	db.Article.find({ saved: true })
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
	});

// Retrieve data from the db
app.get("/articles", function(req, res) {
	db.Article.find({})
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});

// 3. Scrape data and put in Mongodb
app.get("/scrape", function(req, res) {

	axios.get("http://www.washingtonpost.com").then(function(response) {

		var $ = cheerio.load(response.data);
		$("div.headline").each(function(i, element) {
			var result = {};
			result.title = $(this)
				.text();
			result.link = $(this)
				.children()
				.attr("href");
			result.summary = $(this)
				.siblings()
				.text();

			db.Article.create(result)
				.then(function(dbArticle) {
				})
				.catch(function(err) {
					return res.json(err);
				});
		});

	res.send("Scrape Complete");
	});		
});

app.get("/articles/:id", function(req, res) {
	db.Article.find({ _id: req.params.id })
	.then(function(dbArticle) {
		res.json(dbArticle);
	})
	.catch(function(err) {
		res.json(err);
	});
});

app.post("/articles/:id", function(req, res) {
	db.Article.findOneAndUpdate({ _id: req.params.id }, {
		saved: true
	})

	.then(function(dbArticle) {
		res.json(dbArticle);
		console.log(dbArticle);
	})
	.catch(function(err) {
		res.json(err);
	});
});


app.listen(PORT, function() {
	console.log("App running on port 3000!");
});
	
