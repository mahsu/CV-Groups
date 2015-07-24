var Group = require("../models/group");

var groupcontroller = {};
var resultJson = {};
resultJson.status = 1;
resultJson.res = "";

groupcontroller.add = function (req, res, next) {
    var group = new Group({
        //todo add more fields
        name: req.body.groupname,
        type: req.body.grouptype,
        description: req.body.description,
        users: [req.user._id],
        owner: req.user._id,
        moderators: [req.user._id]
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
    var group = Group.find({}, 'name type description',function (err, data) {
        if (err) {
            resultJson.status = 0;
            resultJson.res = err;
            res.send(resultJson);
        }
        else {
            resultJson.res = data;
            res.send(resultJson);
        }
    });
};

groupcontroller.showAllPosts = function (req, res, next) {
    var group = Group.findOne({ 'name': req.params.groupname }, 'users posts', function (err, data) {
        if (err||!data) {
            resultJson.status = 0;
            resultJson.res = err;
            res.send(resultJson);
        }
        else {
            var index = data.users.indexOf(req.user._id);
            if (index == -1) {
                resultJson.status = 0;
                resultJson.res = "You are not a member of this group";
                res.send(resultJson);
            }
            else {
                group.populate('posts').exec(function (err, postData) {
                    if (err) {
                        resultJson.status = 0;
                        resultJson.res = err;
                        res.send(resultJson);
                    }
                    else {
                        resultJson.res = postData;
                        res.send(resultJson);
                    }
                });
            }
        }
    });

};

groupcontroller.findGroupByName = function (req, res, next) {
    var group = Group.findOne({ 'name': req.params.groupname }, 'name type description', function (err, data) {
        if (err) {
            resultJson.status = 0;
            resultJson.res = err;
            res.send(resultJson);
        }
        else {
            resultJson.res = data;
            res.send(resultJson);
        }
    });
};

groupcontroller.findGroupByType = function (req, res, next) {
    var group = Group.find({ 'type': req.params.grouptype }, 'name type description', function (err, data) {
        if (err) {
            resultJson.status = 0;
            resultJson.res = err;
            res.send(resultJson);
        }
        else {
            resultJson.res = data;
            res.send(resultJson);
        }
    });
};

module.exports = groupcontroller;