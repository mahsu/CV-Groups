"use strict";
var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date},
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tags: [String],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    upvoted_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', index: { unique: true } }],
    downvoted_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', index: { unique: true } }]
});

module.exports = mongoose.model('Post', postSchema);