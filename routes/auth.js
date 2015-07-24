var express = require('express');
var passport = require('passport');
var router = express.Router();
var auth = require('../controllers/auth');


router.post('/register', auth.register, function(req, res, next) {
});

router.post('/login', passport.authenticate('local'));

router.get('/logout', auth.logout);

module.exports = router;
