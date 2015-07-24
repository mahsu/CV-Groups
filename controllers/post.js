var Group = require("../models/group");
var Post = require("../models/post");
var Comment = require("../models/comment");

var postcontroller = {};
var resultJson = {};
resultJson.status = 1;
resultJson.res = "";

//adding post in a group
postcontroller.addPost = function (req, res, next) {
    //console.log(req.user);
    if (!req.user._id) {
        resultJson.status = 0;
        resultJson.res = "No user id found";
        res.send(resultJson);
    }
    else {
        var group = Group.findOne({ 'name': req.body.groupname }, function (err, data) {
            if (err) {
                resultJson.status = 0;
                resultJson.res = "The group you want to post in does not exist";
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
                   // console.log(req.user.name);
                    var newPost = new Post({
                        //todo add more fields
                        body: req.body.postbody,
                        author: {
                            _id: req.user._id,
                            name: {
                                first: req.user.name.first,
                                last: req.user.name.last
                            }
                        },
                        tags: req.body.posttags
                    });
                   // console.log(newPost);
                    newPost.save(function (err, postData) {
                        if (err) {
                            resultJson.status = 0;
                            resultJson.res = "Post creation failed";
                            res.send(resultJson);
                        }
                        else {
                            data.posts.push(postData._id);
                            data.save(function (err) {
                                if (err) {
                                    resultJson.status = 0;
                                    resultJson.res = "Failed to add post";
                                    res.send(resultJson);
                                }
                                else {
                                    resultJson.res = "Post successfully added";
                                    res.send(resultJson);
                                }
                            });
                        
                        }
                    });
                }
            }
        });
    }
    
};

//adding comments to a post in a group
postcontroller.addComment = function (req, res, next) {
    
    if (!req.user._id) {
        resultJson.status = 0;
        resultJson.res = "No user id found";
        res.send(resultJson);
    }
    else {
        var group = Group.findOne({ 'name': req.body.groupname }, function (err, data) {
            if (err) {
                resultJson.status = 0;
                resultJson.res = "The group you want to post in does not exist";
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
                    var findPost = Post.findOne({ '_id': req.body.postid }, function (err, postData) {
                        if (err||!postData) {
                            resultJson.status = 0;
                            resultJson.res = "Post not found";
                            res.send(resultJson);
                        }
                        else {
                            var newComment = new Comment({
                                //todo add more fields
                                body: req.body.commentbody,
                                author: {
                                    _id: req.user._id,
                                    name: {
                                        first: req.user.name.first,
                                        last: req.user.name.last
                                    }
                                }
                            });
                            newComment.save(function (err, commentData) {
                                if (err) {
                                    resultJson.status = 0;
                                    resultJson.res = "Comment creation failed";
                                    res.send(resultJson);
                                }
                                else {
                                    postData.comments.push(commentData._id);
                                    postData.save(function (err) {
                                        if (err) {
                                            resultJson.status = 0;
                                            resultJson.res = "Failed to add comment";
                                            res.send(resultJson);
                                        }
                                        else {
                                            resultJson.res = "Comment successfully added";
                                            res.send(resultJson);
                                        }
                                    });
                        
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    
};
//get all posts by user
postcontroller.viewAll = function (req, res, next) {
    
    if (!req.user._id) {
        resultJson.status = 0;
        resultJson.res = "No user id found";
        res.send(resultJson);
    }
    else {
        var group = Post.find({ 'author._id': req.user._id }, function (err, data) {
            if (err) {
                resultJson.status = 0;
                resultJson.res = "You dont have any posts";
                res.send(resultJson);
            }
            else {
                    resultJson.res = data;
                    res.send(resultJson);
                }
        });
    }
    
};
postcontroller.showComments = function (req, res, next) {
    var getcomment = Post.findOne({ '_id': req.params.id }, 'comments', function (err, data) {
        if (err || !data) {
            resultJson.status = 0;
            resultJson.res = err;
            res.send(resultJson);
        }
        else {
            
                getcomment.populate('comments').exec(function (err, postData) {
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
        
    });

};

postcontroller.getComment = function (req, res, next) {
    var getcomment = Comment.findOne({ '_id': req.params.id },  function (err, data) {
        if (err || !data) {
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

//view individual posts by user
postcontroller.viewPost = function (req, res, next) {
    
    if (!req.user._id) {
        resultJson.status = 0;
        resultJson.res = "No user id found";
        res.send(resultJson);
    }
    else {
        var group = Post.findOne({ 'author._id': req.user._id,'_id':req.params.id }, function (err, data) {
            if (err) {
                resultJson.status = 0;
                resultJson.res = "Cannot find the post you are looking for";
                res.send(resultJson);
            }
            else {
                resultJson.res = data;
                res.send(resultJson);
            }
        });
    }
    
};

//delete posts by user
postcontroller.deletePost = function (req, res, next) {
    
    if (!req.user._id) {
        resultJson.status = 0;
        resultJson.res = "No user id found";
        res.send(resultJson);
    }
    else {
        var group = Post.findOne({ 'author': req.user._id, '_id': req.params.id }).remove(function (err, data) {
            if (err) {
                resultJson.status = 0;
                resultJson.res = "Post deletion failed";
                res.send(resultJson);
            }
            else {
                resultJson.res = "Post was successfully removed ";
                res.send(resultJson);
            }
        });
    }
    
};

//view individual posts by user
postcontroller.upvote = function (req, res, next) {
    
    if (!req.user._id) {
        resultJson.status = 0;
        resultJson.res = "No user id found";
        res.send(resultJson);
    }
    else {
        var group = Post.findOne({ '_id': req.params.id }, function (err, data) {
            if (err) {
                resultJson.status = 0;
                resultJson.res = "Cannot find the post you are looking for";
                res.send(resultJson);
            }
            else {
                if (data.upvoted_by.indexOf(req.user._id) != -1) {
                    resultJson.status = 0;
                    resultJson.res = "Failed to upvote";
                    return res.send(resultJson);

                }
                var index = data.downvoted_by.indexOf(req.user._id);
                if (index > -1) {
                    data.downvoted_by.splice(index, 1);
                }
                data.upvoted_by.push(req.user._id);
                data.save(function (err) {
                    if (err) {
                        resultJson.status = 0;
                        resultJson.res = "Failed to upvote";
                        res.send(resultJson);
                    }
                    else {
                        resultJson.res = "Post successfully upvoted";
                        res.send(resultJson);
                    }
                });
            }
        });
    }
    
};

//view individual posts by user
postcontroller.downvote = function (req, res, next) {
    
    if (!req.user._id) {
        resultJson.status = 0;
        resultJson.res = "No user id found";
        res.send(resultJson);
    }
    else {
        var group = Post.findOne({ '_id': req.params.id }, function (err, data) {
            if (err) {
                resultJson.status = 0;
                resultJson.res = "Cannot find the post you are looking for";
                res.send(resultJson);
            }
            else {
                if (data.downvoted_by.indexOf(req.user._id) != -1) {
                    resultJson.status = 0;
                    resultJson.res = "Failed to downvote";
                    return res.send(resultJson);
                }
                var index = data.upvoted_by.indexOf(req.user._id);
                if (index > -1) {
                    data.upvoted_by.splice(index, 1);
                }
                data.downvoted_by.push(req.user._id);
                data.save(function (err) {
                    if (err) {
                        resultJson.status = 0;
                        resultJson.res = "Failed to downvote";
                        res.send(resultJson);
                    }
                    else {
                        resultJson.res = "Post successfully downvoted";
                        res.send(resultJson);
                    }
                });
            }
        });
    }
    
};

module.exports = postcontroller;