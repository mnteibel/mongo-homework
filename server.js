var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var cheerio = require("cheerio")
var axios = require("axios")
var path = require("path")

var app = express()

var db = require("./models/Article.js")

app.use(express.static(path.join(__dirname, "views")))

app.use(bodyParser.urlencoded({ extended: false }))

var exphbs = require("express-handlebars")
app.engine("handlebars", exphbs({defaultLayout: "main"}))
app.set("view engine", "handlebars")

mongoose.Promise = Promise
mongoose.connect("mongodb://localhost:27017/mongoscrape", {
	useMongoClient: true
})

app.get("/", function(req, res) {
	res.send("Hello World!")
})

// GET route for scraping website
app.get("/scrape", function(req, res) {
	axios.get("https://www.reddit.com/r/fantasyfootball/").then(function(response) {
	// Load data into cheerio into variable $
	var $ = cheerio.load(response.data)


		$("p.title").each(function(i, element) {

			results = {}
			results.title = $(this).children("a").text()
			results.link =  $(this).children("a").attr("href")
			results.summary = $(this).children

			db.create(results).then(function(dbArticle) {
				res.send("Scrape Complete")
			}).catch(function(err) {
				res.json(err)
			})
		})
	})
})

app.get("/articles", function(req, res) {
	db.find({}).then(function(dbArticle) {
		articleObject = {articles: dbArticle}
		res.render("home", articleObject)
	// 	res.json(dbArticle)
	// }).catch(function(err) {
	// 	res.json(err)
	})
})

var PORT = process.env.PORT || 8080

app.listen(PORT, function() {
	console.log("App is listening on PORT " + PORT)
})