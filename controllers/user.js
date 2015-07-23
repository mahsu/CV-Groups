var User = require("../models/user");
var Group = require("../models/group");

var usercontroller = {};

usercontroller.addgroup = function(req, res, next) {
    var group = Group.findOne({ 'name': req.body.groupname }, function (err, data) {
        data.users.add(req.user._id);
    });
};

usercontroller.removegroup = function (req, res, next) {
    var group = Group.findOne({ 'name': req.body.groupname }, function (err, data) {
        var index = data.users.indexOf(req.user._id);
        if (index < 0) {
            res.send("You are not a member of this group");
        }
        else {
            data.users.splice(index, 1);
            res.send("You have been removed from this group");
        }
    });
};

module.exports = usercontroller;