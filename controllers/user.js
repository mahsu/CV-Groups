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

//get all groups user is a member of
usercontroller.viewAll = function (req, res, next) {
    
    if (!req.user._id) {
        resultJson.status = 0;
        resultJson.res = "No user id found";
        res.send(resultJson);
    }
    else {
        var group = Group.find({ }, function (err, data) {
            if (err) {
                resultJson.status = 0;
                resultJson.res = "There are no groups for now";
                res.send(resultJson);
            }
            else {
                var userGroups = [];
                for (d in data) {
                    var isInArray = data[d].users.some(function (check) {
                        if (check.equals(req.user._id))
                            userGroups.push(data[d]);
                    });
                }
                resultJson.res = userGroups;
                res.send(resultJson);
            }
        });
    }
};

//view individual group by id
usercontroller.viewGroup = function (req, res, next) {
    
    if (!req.user._id) {
        resultJson.status = 0;
        resultJson.res = "No group found";
        res.send(resultJson);
    }
    else {
        var group = Group.findOne({ '_id': req.params.id }, function (err, data) {
            if (err) {
                resultJson.status = 0;
                resultJson.res = "Cannot find the group you are looking for";
                res.send(resultJson);
            }
            else {
                var index = data.users.indexOf(req.user._id);
                if (index > -1)
                    resultJson.res = data;
                else {
                    resultJson.res = { "_id": data._id, "name": data.name, "type": data.type, "description": data.description};
                }
                res.send(resultJson);
            }
        });
    }
    
};

module.exports = usercontroller;