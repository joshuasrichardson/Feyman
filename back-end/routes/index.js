var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//post the new article to the database
router.post('/', (req, res, next) => {
  const article = new Article({
    title: req.body.title,
    author: req.body.author,
    text: req.body.text,
  });
  article.save((err, article) => {
    if (err) {
      return next(err);
    }
    res.json(article);
  });
});

module.exports = router;
