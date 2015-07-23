"use strict";
var express = require('express');
var router = express.Router();
var group = require('../controllers/group');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('just entered groups');
});

router.post('/add', group.add);
router.post('/delete', group.delete);

module.exports = router;
