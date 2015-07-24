var User = require("../models/user");
var Group = require("../models/group");

var usercontroller = {};
var resultJson = {};
resultJson.status = 1;
resultJson.res = "";

//adding user to a particular group
usercontroller.addgroup = function(req, res, next) {
    var group = Group.findOne({ 'name': req.body.groupname }, function (err, data) {
        var index = data.users.indexOf(req.user._id);
        if (index == -1) {
            data.users.push(req.user._id);
            data.save(function (err) {
                if (err) {
                    resultJson.status = 0;
                    resultJson.res = "Add to group failed";
                    res.send(resultJson);
                }
                else {
                    resultJson.res = "You have been added to this group";
                    res.send(resultJson);
                }
            });
        }
        else {
            resultJson.status = 0;
            resultJson.res = "You already a member of this group";
            res.send(resultJson);
        }
    });
    
};
//removing user from a particular group
usercontroller.removegroup = function (req, res, next) {
    var group = Group.findOne({ 'name': req.body.groupname }, function (err, data) {
        var index = data.users.indexOf(req.user._id);
        if (index == -1) {
            resultJson.status = 0;
            resultJson.res = "You not a member of this group";
            res.send(resultJson);
        }
        else {
            data.users.splice(index, 1);
            data.save(function (err) {
                if (err) {
                    resultJson.status = 0;
                    resultJson.res = "Removing from group failed";
                    res.send(resultJson);
                }
                else {
                    resultJson.res = "You have been removed from this group";
                    res.send(resultJson);
                }
            });
        }
    });
};

module.exports = usercontroller;