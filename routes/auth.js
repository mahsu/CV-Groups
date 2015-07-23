var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');

router.get('/register', function(req, res, next) {
});

router.post('/register', auth.register, function(req, res, next) {
});

router.get('/login', function(req, res, next) {});
router.post('/login', passport.authenticate('local'), function(req, res, next) {});

router.get('/logout', auth.logout());

module.exports = router;
