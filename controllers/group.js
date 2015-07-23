"use strict";
var Group = require("../models/group");

var groupcontroller = {};

groupcontroller.add = function (req, res, next) {
    var group = new Group({
        //todo add more fields
        name: req.body.groupname,
        type: req.body.grouptype
    });
    group.save(function (err, data) {
        if (err) console.log(err);
        else console.log('Saved : ', data);
    });
};

groupcontroller.delete = function (req, res, next) {
    Group.findOne({'name': req.body.groupname}).remove(function (err, data) {
        if (err) return handleError(err);
        else {
            console.log('Removed : ', data);
            res.send("Group " + req.body.groupname + " successfully removed ");
        }
    })
};


module.exports = groupcontroller;