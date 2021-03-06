var express = require('express');
var router = express.Router();

router.get('/app', function(req, res) {
    res.render('app');
});

router.get('/', function(req, res) {
    //res.render('login');
    res.redirect('/auth/login');
});

router.get('/partials/:name', function(req, res) {
    res.render('partials/' + req.params.name);
});

module.exports = router;
