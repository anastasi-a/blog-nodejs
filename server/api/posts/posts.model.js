"use strict";

const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
    text: {type: String},
    title: {type: String},
    image: {type: String},
    addedAt: {type: Date, default: Date.now},
    addedBy: {type: Schema.ObjectId, ref: "UsersModel"},
    show: {type: Boolean, default: true},
    tags: [{type: String}],
    // comments: [{type: Schema.ObjectId, ref: "CommentsModel"}]
}, {
    collection: "PostsCollection"
});

module.exports = mongoose.model("PostsModel", PostsSchema);