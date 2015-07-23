var Group = require("../models/group");

var groupcontroller = {};
groupcontroller.add = function(req, res, next) {
    var group = new Group({
        //todo add more fields
        name: req.body.groupname,
        type: req.body.grouptype
    });
    group.save(function (err, data) {
        if (err) {
            console.log(err);
            res.send("Group creation failed");
        }
        else res.send("Group " + req.body.groupname + " successfully added ");
    });
};

groupcontroller.delete = function(req, res, next) {
    var group = Group.findOne({ 'name': req.body.groupname }).remove(function (err, data) {
        if (err) return handleError(err);
        else {
            console.log('Removed : ', data);
            res.send("Group "+ req.body.groupname+" successfully removed ");
        }
    })
};

groupcontroller.showAll = function (req, res, next) {
    var group = Group.find({}, function (err, data) {
        res.send(data);
    });
};

groupcontroller.findGroupByName = function (req, res, next) {
    var group = Group.findOne({'name': req.params.groupname}, function (err, data) {
        res.send(data);
    });
};

groupcontroller.findGroupByType = function (req, res, next) {
    var group = Group.find({ 'type': req.params.grouptype }, function (err, data) {
        res.send(data);
    });
};

module.exports = groupcontroller;