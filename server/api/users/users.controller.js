"use strict";

const UsersModel = require('./users.model');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.getLogin = (req, res) => {
    res.render('login.nunjucks');
    req.app.locals.io.to('all').emit('news', 'login');
};

exports.getSingup = (req, res) => {
    res.render('singup.nunjucks');
};

exports.getUser = (req, res) => {
    const user = req.user ? req.user : null;
    res.render('user.nunjucks', {user: user});
};

exports.registerUser = (req, res) => {
    let sampleFile = req.files.photo;
    const pathFile = path.join(__dirname, '..', '..', '..', 'client', 'public', 'users', sampleFile.name);
    const file = path.join('public', 'users', sampleFile.name);
    sampleFile.mv(pathFile, (err) => {
        if (err) return res.status(500).send(err);
    });
    UsersModel.create({
        username: req.body.username,
        password: req.body.password,
        image: file,
        email: req.body.email
    }, (err, user) => {
        if(err) {
            return res.status(400).send({message: err.message});
        } 
        else {
            return res.render('user.nunjucks', {user: user});
        } 
    });
};

exports.logInUser = (req, res) => {
    const user = req.user ? req.user : null;
    res.render('user.nunjucks', {user: user});
};

exports.logOutUser = (req, res) => {
    req.session.destroy( err => {
        if(err) console.error(err);
        res.redirect('/');
    });
};

exports.getUserById = async (req, res) => {
    try {
        const user = await UsersModel
            .findById(req.params.id)
            .lean()
            .exec();

        if(!user) {
            return res.status(404).send({message: "Not found"});
        }

        const posts = await mongoose
            .model("PostsModel")
            .find({
                addedBy: mongoose.Types.ObjectId(req.params.id)
            })
            .sort({addedAt: -1})
            .select('title text image tags addedAt addedBy')
            .populate([
                {
                    path: "addedBy",
                    select: "username image"
                }
            ])
            .lean()
            .exec();

        const name = req.user ? req.user.username : null;
        res.render('user-id.nunjucks', {name: name, user: user, posts: posts});
    } catch (e) {
        res.status(400).send(e.message || e);
    }
};

exports.getAdmin = (req, res) => {
    UsersModel
        .find()
        .select('username email addedAt role')
        .lean()
        .exec( (err, users) => {
            if (err) {
                return res.status(400).send(err.message || err);
            } else {
                res.render('admin.nunjucks', {users: users});
            }
        });
};

exports.changeUserRole = (req, res) => {
    UsersModel
        .findByIdAndUpdate(req.params.id, {
            $set: {
                role: req.body.newRole
            }
        })
        .exec( err => {
            if(err) {
                return res.status(400).send({message: err.message});
            } else {
                const user = {
                    id: req.params.id,
                    role: req.body.newRole
                }
                return res.send(user);
            }
        })
};
