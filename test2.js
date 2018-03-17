// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "news";
var collections = ["articles"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
// 1. At the root path, send a simple hello world message to the browser
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public.index.html"));
});

// 2. Retrieve data from the db
app.get("/all", function(req, res) {
	db.articles.find({}, function(error, found) {
		if(error) {
			console.log(error);
		}
		else {
			res.json(found);
		}
	});
});

// 3. Scrape data and put in Mongodb
app.get("/scrape", function(req, res) {
	request("https://www.washingtonpost.com", function(error, response, html) {
		var $ = cheerio.load(html);
		$("div.headline").each(function(i, element) {
			var title = $(element).text();
			var link = $(element).children().attr("href");
			var summary = $(element).siblings().text();

			console.log(summary);


			if(title && link) {
				db.articles.save({
					title: title,
					link: link,
					summary: summary
			},
			function(err, inserted) {
				if(err) {
					console.log(err);
				} else {
					console.log(inserted);
				}
				});
				}
			});
			});

	res.send("Scrape Complete");
		
});


// app.get("/titles" function(req, res) {
// 	db.articles.find().sort({title: 1 }, function(error, found) {
// 		if(error) {
// 			console.log(error);
// 		} else {
// 			res.json(found)
// 		}
// 	});
// });

app.listen(3000, function() {
	console.log("App running on port 3000!");
});
	
