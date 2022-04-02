const mongoose = require('mongoose');
const users = require("../routes/users.js");
const User = users.model;

const ArticleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
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
