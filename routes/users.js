"use strict";
var express = require('express');
var router = express.Router();
var user = require('../controllers/user');
var postcontroller = require('../controllers/post');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('just entered users');
});

// user - group interaction APIs
router.get('/viewgroup', user.viewAll);
router.get('/viewgroup/:id', user.viewGroup);

router.post('/addgroup', user.addgroup);
router.post('/removegroup', user.removegroup);

//user post and comments APIs

router.get('/viewpost', postcontroller.viewAll);
router.get('/viewpost/:id', postcontroller.viewPost);
router.get('/deletepost/:id', postcontroller.deletePost);

router.get('/upvote/:id', postcontroller.upvote);
router.get('/downvote/:id', postcontroller.downvote);


router.post('/addpost', postcontroller.addPost);
router.post('/addcomment', postcontroller.addComment);
module.exports = router;