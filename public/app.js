
// Grab the articles as a json:
$.getJSON("/articles", function(data) {
	console.log("data:");
	console.log(data);


	$("tbody").empty();

	for (var i = 0; i < data.length; i++) {
		console.log("for loop");

			$("tbody").append("<tr><td>" + data[i].title + "</td>" + "<td>" + data[i].summary + "</td>" + "<td>" + "<button type='button' class='btn btn-primary save' data-id='" + data[i]._id + "'>Save Article</button>" + "</td></tr>");
				console.log(data[i].title);
				console.log(data[i]._id);
	}
	});


// Whenever someone clicks save on an article:
$(document).on("click", ".save", function() {
	console.log("save click");
	var thisId = $(this).attr("data-id");
	console.log(thisId);
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			saved: true
		}
	})
		.then(function(data) {
			console.log("2nd collection used");
			console.log(data);
		});
	alert("Article Saved!");
});


$(document).on("click", ".scrape-articles", function() {
	$.ajax({
		method: "GET",
		url: "/scrape"
	})
		.then(function(data) {
		});

	document.location.href = "../";
});

$(document).on("click", ".saved-articles", function() {

		$.getJSON("/saved", function(data) {

			$("tbody").empty();

			for (var i = 0; i < data.length; i++) {
				console.log("for loop");

					$("tbody").append("<tr><td>" + data[i].title + "</td>" + "<td>" + data[i].summary + "</td>" + "<td>" + "<a href=" + data[i].link + ">Link to Article</a>" + "</td></tr>");
			}
		});
});


$(document).on("click", ".home", function() {
	document.location.href = "../";
});

$(document).on("click", ".mongo-btn", function() {
	document.location.href = "../";
});