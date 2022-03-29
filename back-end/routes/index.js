var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//post the new article to the database
router.post('/', (req, res, next) => {
  
});

module.exports = router;
