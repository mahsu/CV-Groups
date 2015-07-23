var express = require('express');
var router = express.Router();
var distance = require('google-distance');
var gmaps = require('googlemaps');
var async = require('async');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('just entered carpool');
});

//Given Place1, Place2, and the Destination, the function will return the place at which you should start for the shorter distance
router.get('/map/:place1/:place2/:dest', function (req, res, next) {
    var d12; //Distance from 1 to 2
    var d21; //Distance from 2 to 1
    var d1; //Distance from 1 to dest
    var d2; //Distance from 2 to dest

    console.log("Place1 = " + req.params.place1 + ", Place2 = " + req.params.place2 + ", Dest = " + req.params.dest);

    async.parallel({
        d12: function (done) {
            distance.get(
                {
                    origin: req.params.place1,
                    destination: req.params.place2
                },
                function (err, data) {
                    done(err, parseInt(data.distanceValue));
                }
            )
        },
        d21: function (done) {
            distance.get(
                {
                    origin: req.params.place2,
                    destination: req.params.place1
                },
                function (err, data) {
                    done(err, parseInt(data.distanceValue));
                }
            )
        },
        d1: function (done) {
            distance.get(
                {
                    origin: req.params.place1,
                    destination: req.params.dest
                },
                function (err, data) {
                    done(err, parseInt(data.distanceValue));
                }
            )
        },
        d2: function (done) {
            distance.get(
                {
                    origin: req.params.place2,
                    destination: req.params.dest
                },
                function (err, data) {
                    done(err, parseInt(data.distanceValue))
                }
            )
        }
    }, function (err, result) {
        console.log("Path1 = " + result.d12 + result.d2);
        console.log("Path2 = " + result.d21 + result.d1);

        if ((result.d12 + result.d2) > (result.d21 + result.d1)) {
            res.send(req.params.place2);
        }
        else {
            res.send(req.params.place1);
        }
    })


});

/* GET users listing. */
router.get('/users', function (req, res, next) {
    res.send('just entered carpool users request');
});

module.exports = router;
