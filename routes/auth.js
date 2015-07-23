"use strict";
var express = require('express');
var passport = require('passport');
var router = express.Router();
var auth = require('../controllers/auth');

router.get('/register', function(req, res, next) {
});

router.post('/register', auth.register, function(req, res, next) {
    res.send(req);
});

router.get('/login', function(req, res, next) {});
router.post('/login', passport.authenticate('local'), function(req, res, next) {
    console.log(req.user);
    res.send(req.user);
});

router.get('/logout', auth.logout);

module.exports = router;
