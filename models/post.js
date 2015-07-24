"use strict";
var mongoose = require('mongoose');


var commentSchema = new mongoose.Schema({
    created_at: {type: Date, defualt: Date.now},
    modified_at: {type: Date},
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var postSchema = new mongoose.Schema({
    created_at: {type: Date, defualt: Date.now},
    modified_at: {type: Date},
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tags: [String],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    upvoted_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    downvoted_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Post', postSchema);