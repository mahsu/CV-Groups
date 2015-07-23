var User = require("../models/user");
var Group = require("../models/group");

var usercontroller = {};

usercontroller.addgroup = function(req, res, next) {
    var group = Group.findOne({ 'name': req.params.groupname }, function (err, data) {
        data.users.add();
    });
};

module.exports = usercontroller;