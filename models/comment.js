"use strict";
var mongoose = require('mongoose');


var commentSchema = new mongoose.Schema({
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date},
    body: String,
    author: {
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        name: {
            first: String,
            last: String
        }
    }
});

module.exports = mongoose.model('Comment', commentSchema);