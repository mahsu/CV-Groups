"use strict";
var mongoose = require('mongoose');


var commentSchema = new mongoose.Schema({
    created_at: {type: Date, defualt: Date.now},
    modified_at: {type: Date},
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Comment', commentSchema);