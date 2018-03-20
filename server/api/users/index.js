"use strict";

const express = require('express');
const router = express.Router();
const path = require('path');
const ctrl = require('./users.controller');
const passport = require('passport');
const authorization = require('express-rbac');
const _ = require('lodash');
const middle = require('../middleware');

router.use("/public", express.static(path.join(__dirname, '..', '..', '..', 'client', 'public')));

router.get('/singup', ctrl.getSingup);

router.get('/login', ctrl.getLogin);

router.get('/user', ctrl.getUser);

router.post('/register', _.partial(middle.checkValidation, 'users', 'validateRegistration'), ctrl.registerUser);

router.post('/login', passport.authenticate('local',{}), ctrl.logInUser);

router.get('/logout', ctrl.logOutUser);

router.get('/admin', authorization.hasPermission("changeRole"), ctrl.getAdmin);

router.get('/:id', ctrl.getUserById);

router.put('/:id', authorization.hasPermission("changeRole"), _.partial(middle.checkValidation, 'users', 'changeRole'), ctrl.changeUserRole);

module.exports = router;