"use strict";
var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date},
    belongs_to: {type: mongoose.Schema.Types.ObjectId, ref: "Group"},
    body: String,
    author: {
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        name: {
            last: String,
            first: String

        }
    },
    tags: [String],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    upvoted_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', index: { unique: true } }],
    downvoted_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', index: { unique: true } }]
});

postSchema.index({body: "text"});
module.exports = mongoose.model('Post', postSchema);