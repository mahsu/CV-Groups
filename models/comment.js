"use strict";
var mongoose = require('mongoose');


var commentSchema = new mongoose.Schema({
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date},
    belongs_to: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    body: String,
    author: {
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        name: {
            first: String,
            last: String
        }
    }
});
commentSchema.index({body: "text"});

module.exports = mongoose.model('Comment', commentSchema);