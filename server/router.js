"use strict";

const path = require('path');
const passport = require('passport');
const LocalsStrategy = require('passport-local').Strategy;
const UsersModel = require('./api/users/users.model');
const authorization = require("express-rbac");

const permissions = {
    user: ['addPost', 'addComment'],
    moderator: ['addPost', 'edit', 'addComment'],
    admin: ['addPost', 'edit', 'addComment', 'show', "changeRole"]
};

module.exports = (app) => {
    //passport local strategy
    passport.use(new LocalsStrategy({passReqToCallback: true},
        function (req, username, password, done) {
            UsersModel.checkPassword(username, password, (err, userChecked) => {
                if(err) done({message: err.message});
                else if (userChecked) done(false, userChecked);
                else done({message: "Login or password is not correct"});
            });
        }
    ));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (id, cb) {
        UsersModel
            .findById(id)
            .select('username role email image')
            .lean()
            .exec(function (err, user) {
                if (err) { return cb(err); }
                cb(null, user);
            });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(authorization.authorize({bindToProperty: "user"}, function(req, done) {
        if(!req.isAuthenticated()) {
            done(false);
        } else {
            const authData = {roles: [req.user.role], permissions: permissions[req.user.role]};
            done(authData);
        }
    }));

    function importModule(name) {
        return require(path.join(__dirname, "api", name));
    }

    app.use('/', importModule("main"));
    app.use('/comments', importModule("comments"));
    app.use('/posts', importModule("posts"));
    app.use('/users', importModule("users"));

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        const err = new Error('Not found');
        err.status = 404;
        next(err);
    });
};