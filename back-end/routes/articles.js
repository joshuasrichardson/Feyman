var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Article = require('../models/Article');

// post the new article to the database
router.post('/', async (req, res) => {
  console.log("Adding article:", req.body);
  const article = new Article({
    title: req.body.title,
    author: req.body.author,
    text: req.body.text,
  });
  try {
    await article.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all articles from the database
router.get("/all", async (req, res) => {
  try {
    let articles = await Article.find().sort({
      created: -1
    });
    return res.send(articles);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
};
