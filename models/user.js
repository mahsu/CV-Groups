var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const RADIUS_OF_EARTH = 3959;

var User = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    email: {type: String, lowercase: true},
    address: String,
    loc: {type: {type: String}, coordinates: [Number]},//[lon,lat]
    _distance: Number //virtual property for use in geonear
});

//login fields abstracted by passport-local-mongoose
User.plugin(passportLocalMongoose);

User.methods.findNearby = function(maxdist, callback) {
    var _this = this;
    _this.geoNear(this.loc, { maxDistance: maxdist, spherical: true, distanceMultiplier: RADIUS_OF_EARTH}, function(err, results, stats){
        if (err) {return callback(err);}
        console.log(results);
        console.log(stats);

        //map each result to new object using distance
        results = results.map(function(x){
            var y = new _this(x.obj);
            y._distance = x.dist;
            return y;
        });
        callback(results);
    });
};

module.exports = mongoose.model('User', User);