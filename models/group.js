"use strict";
var mongoose = require('mongoose');

//var User = require('./User');


var grouptypes = 'classified carpool general finance'.split(' ');

var groupSchema = new mongoose.Schema({
    name: { type: String, index: { unique: true } },
    type: { type: String, enum: grouptypes },
    description: { type: String },
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});


module.exports = mongoose.model('Groups', groupSchema);