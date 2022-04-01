const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,
  author: String,
  text: String,
});

mongoose.model('Articles', ArticleSchema);
