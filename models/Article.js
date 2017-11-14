var mongoose = require("mongoose")

var Schema = mongoose.Schema

var ArticleSchema = new Schema({

	title: {
		type: String,
		require: true
	},
	link: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		requried: false
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}]
})

var Article = mongoose.model("Article", ArticleSchema)

module.exports = Article