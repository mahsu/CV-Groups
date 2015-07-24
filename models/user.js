var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const RADIUS_OF_EARTH = 3959;

var UserSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    email: {type: String, lowercase: true},
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    loc: {type: {type: String}, coordinates: [Number]},//[lon,lat]
    _distance: Number //virtual property for use in geonear
});
UserSchema.index({ loc: '2dsphere' });

//login fields abstracted by passport-local-mongoose
UserSchema.plugin(passportLocalMongoose, {
        usernameField: 'email',
        saltField: 'salt',
        hashField: 'hash',
        lastLoginField: 'last',
        attemptsField: 'attempts',
        usernameLowerCase: true,
        usernameUnique: true,
        usernameQueryFields: 'email'
    }
);

UserSchema.virtual('address.full').get(function () {
    return this.address.street + ' ' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip;
});

UserSchema.statics.findNearby2 = function (user, maxdist, callback) {
    var _this = this;
    var point = {type: "Point", coordinates: [user.loc.coordinates[0],user.loc.coordinates[1]]};
    this.geoNear(point, {
        maxDistance: maxdist,
        spherical: true,
        distanceMultiplier: 3959
    }, function (err, results, stats) {
        if (err) {
            return callback(err);
        }
        console.log(results);
        console.log(stats);

        //map each result to new object using distance
        results = results.map(function (x) {
            var y = new _this(x.obj);
            y._distance = x.dist;
            return y;
        });
        callback(results);
    });
};

module.exports = mongoose.model('User', UserSchema);