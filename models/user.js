var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    email: {type: String, lowercase: true},
    address: String
});

//login fields abstracted by passport-local-mongoose
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);