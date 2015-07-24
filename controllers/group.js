var Group = require("../models/group");

var groupcontroller = {};
var resultJson = {};
resultJson.status = 1;
resultJson.res = "";

groupcontroller.add = function (req, res, next) {
    var group = new Group({
        //todo add more fields
        name: req.body.groupname,
        type: req.body.grouptype
    });
    group.save(function (err, data) {
        if (err) {
            console.log(err);
            resultJson.status = 0;
            resultJson.res = "Group creation failed";
            res.send(resultJson);
        }
        else {
            resultJson.res = "Group " + req.body.groupname + " successfully added ";
            res.send(resultJson);
        }
    });
};

groupcontroller.delete = function (req, res, next) {
    var group = Group.findOne({ 'name': req.body.groupname }).remove(function (err, data) {
        if (err) {
            resultJson.status = 0;
            resultJson.res = "Group deletion failed";
            res.send(resultJson);
        }
        else {
            resultJson.res = "Group " + req.body.groupname + " successfully removed ";
            res.send(resultJson);
        }
    })
};

groupcontroller.showAll = function (req, res, next) {
    var group = Group.find({}, function (err, data) {
        res.send(data);
    });
};

groupcontroller.findGroupByName = function (req, res, next) {
    var group = Group.findOne({ 'name': req.params.groupname }, function (err, data) {
        res.send(data);
    });
};

groupcontroller.findGroupByType = function (req, res, next) {
    var group = Group.find({ 'type': req.params.grouptype }, function (err, data) {
        res.send(data);
    });
};

module.exports = groupcontroller;