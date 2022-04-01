const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,
  author: String,
  text: String,
});

const Article = mongoose.model('Articles', ArticleSchema);

module.exports = Article;
