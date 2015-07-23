var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    email: {type: String, lowercase: true},
    address: String,
    loc: {type: String, coordinates: [Number]},//[lon,lat]
    _distance: Number //virtual property for use in geonear
});
User.index({'address.loc': '2dsphere'});

//login fields abstracted by passport-local-mongoose
User.plugin(passportLocalMongoose, {
    usernameField: 'username',
    saltField: 'salt',
    hashField: 'hash',
    attemptsField: 'attempts',
    usernameLowerCase: true
});

module.exports = mongoose.model('User', User);