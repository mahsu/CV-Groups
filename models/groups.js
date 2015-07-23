"use strict";
var mongoose = require('./mongoose');

var User = require('./User');

var commentSchema = new mongoose.Schema({
    created_at: {type: Date, defualt: Date.now},
    modified_at: {type: Date},
    body: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'}
});

var postSchema = new mongoose.Schema({
    created_at: {type: Date, defualt: Date.now},
    modified_at: {type: Date},
    body: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    tags: [String],
    comments: [commentSchema],
    upvoted_by: [{type: Schema.Types.ObjectId, ref: User}],
    downvoted_by: [{type: Schema.Types.ObjectId, ref: User}]
});

var groupSchema = new mongoose.Schema({
    name: String,
    type: String,
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    posts: [postSchema]
});


module.exports = mongoose.model('Groups', groupSchema);