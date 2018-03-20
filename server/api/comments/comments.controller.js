"use strict";

const CommentsModel = require('./comments.model');
const mongoose = require('mongoose');

exports.addCommentToPost = (req, res) => {
    let createObj = {
        addedBy: mongoose.Types.ObjectId(req.user._id),
        text: req.body.text,
        // rate: req.body.rate,
        postId: mongoose.Types.ObjectId(req.params.id)
    };
    if(req.body.parentId) createObj.parentId = req.body.parentId;

    CommentsModel
        .create(createObj, err => {
            if(err) {
                return res.status(400).send({message: err.message});
            } else {
                const user = {
                    username: req.user.username,
                    image: req.user.image,
                    comment: createObj
                }
                return res.send(user);
            }
        });
};

exports.deleteComment = (req, res) => {
    CommentsModel
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

exports.getCommentsForAdmin = (req, res) => {
    CommentsModel
        .find({})
        .sort({addedAt: -1})
        .populate([ {
            path: "addedBy",
            select: "username"
        }
        ])
        .lean()
        .exec( (err, comments) => {
            if (err) {
                return res.status(400).send(err.message || err);
            } else {
                res.render('admin-comments.nunjucks', {comments: comments});
            }
        });
};

exports.changeCommentStatus = (req, res) => {
    CommentsModel
        .findByIdAndUpdate(req.params.id, {
            $set: {
                show: req.body.newStatus
            }
        })
        .exec(err => {
            if(err) {
                return res.status(400).send({message: err.message});
            } else {
                const comment = {
                    id: req.params.id,
                    status: req.body.newStatus
                };
                return res.send(comment);
            }
        })
}