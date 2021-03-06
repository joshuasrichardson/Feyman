var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Article = require('../models/Article');
const users = require("./users.js");
const validUser = users.valid;

// post the new article to the database
router.post('/', validUser, async (req, res) => {
  console.log("Adding article:", req.body);
  const article = new Article({
    user: req.user,
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

router.get('/view/:id', async (req, res) => {
  try {
    let articleId = req.params.id;
    console.log(articleId);
    let article = await Article.find({ _id: articleId });
    return res.send(article);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.delete("/:id", validUser, async (req, res) => {
  try {
    let articleId = req.params.id;
    console.log(articleId);
    await Article.deleteOne({ _id: articleId });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
};
