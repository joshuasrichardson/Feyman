const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,
  author: String,
  text: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Article = mongoose.model('Articles', ArticleSchema);

module.exports = Article;
