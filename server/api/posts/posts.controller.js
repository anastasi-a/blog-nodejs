"use strict";

const PostsModel = require('./posts.model');
const mongoose = require('mongoose');
const path = require('path');

exports.getPosts = (req, res) => {
    PostsModel
        .find({show: true})
        .sort({[req.query.sortField]: req.query.sortValue})
        .skip(req.query.limit * (req.query.page - 1))
        .limit(req.query.limit)
        .select('title text image tags addedAt addedBy')
        .populate([
            {
                path: "addedBy",
                select: "username image"
            }
        ])
        .lean()
        .exec( (err, docs) => {
            if(err) {
                return res.status(400).send(err.message || err);
            } else {
                const user = req.user ? req.user.username : null;
                res.render('posts.nunjucks', { user: user, docs: docs});
            }
        });
};

exports.getPostById = async (req, res) => {
    try {
        const post = await PostsModel
            .findById(req.params.id)
            .populate([
                {
                    path: "addedBy",
                    select: "username image _id"
                }
            ])
            .lean()
            .exec();

        if(!post) {
            return res.status(404).send({message: "Not found"});
        }

        const comment = await mongoose
            .model("CommentsModel")
            .find({
                postId: mongoose.Types.ObjectId(req.params.id),
                show: true
            })
            .sort({addedAt: -1})
            .populate([
                {
                    path: "addedBy",
                    select: "username image"
                }
            ])
            .lean()
            .exec();

        post.comments = comment;

        const user = req.user ? req.user : null;
        res.render('post.nunjucks', {user: user, post: post});
    } catch(e) {
        console.error("{E} getPostById", e.message);
        res.status(400).send(e.message || e);
    }
};

exports.getNewPostPage = (req, res) => {
    const user = req.user ? req.user.username : null;
    res.render('new-post.nunjucks', {user: user});
};

exports.addNewPost = (req, res) => {
    let sampleFile = req.files.photo;
    const pathFile = path.join(__dirname, '..', '..', '..', 'client', 'public', 'image', sampleFile.name);
    const dirFile = path.join('public', 'image', sampleFile.name);
    sampleFile.mv(pathFile, (err) => {
        if (err) return res.status(500).send(err);
    });
    PostsModel.create({
        text: req.body.text,
        title: req.body.title,
        image: dirFile,
        addedBy: req.user._id,
        tags: req.body.tags,
        comments: req.body.comments
    }, (err, doc) => {
        if(err){
            return res.status(400).send(err.message || err);
        } else {
            const user = req.user ? req.user : null;
            return res.render('post.nunjucks', {user: user, post: doc});
        }
    })
};

exports.getPostsForAdmin = (req, res) => {
    PostsModel
        .find({})
        .sort({addedAt: -1})
        .populate([
            {
                path: "addedBy",
                select: "username"
            }
        ])
        .lean()
        .exec( (err, posts) => {
            if(err) {
                return res.status(400).send(err.message || err);
            } else {
                res.render('admin-posts.nunjucks', {posts: posts});
            }
        });
};

exports.changePostStatus = (req, res) => {
    PostsModel
        .findByIdAndUpdate(req.params.id, {
            $set: {
                show: req.body.newStatus
            }
        })
        .exec(err => {
            if(err) {
                return res.status(400).send({message: err.message});
            } else {
                const post = {
                    id: req.params.id,
                    status: req.body.newStatus
                };
                return res.send(post);
            }
        })
};

exports.deletePost = (req, res) => {
    PostsModel
        .findByIdAndRemove(req.params.id)
        .lean()
        .exec( err => {
            if (err) {
                return res.status(400).send(err.message || err);
            } else {
                res.send(req.params.id);
            }
        });
};