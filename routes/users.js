var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('just entered users');
});


router.post('/addgroup', user.addgroup);
router.post('/removegroup', user.removegroup);


module.exports = router;
