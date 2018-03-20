"use strict";

const express = require('express');
const router = express.Router();
const path = require('path');
const ctrl = require('./posts.controller');
const middle = require('../middleware');
const _ = require('lodash');
const authorization = require('express-rbac');

router.use("/public", express.static(path.join(__dirname, '..', '..', '..', 'client', 'public')));

router.get('/', _.partial(middle.checkValidation, 'posts', 'getPosts'), ctrl.getPosts);

router.get('/new-post', ctrl.getNewPostPage);

router.post('/post', authorization.hasPermission('addPost'), _.partial(middle.checkValidation, 'posts', 'validateReceivedPost'), ctrl.addNewPost);

router.get('/admin', authorization.hasPermission("edit"), ctrl.getPostsForAdmin);

router.put('/:id', authorization.hasPermission("show"), _.partial(middle.checkValidation, 'posts', 'changeStatus'), ctrl.changePostStatus);

router.delete('/:id', authorization.hasPermission("edit"), ctrl.deletePost);

router.get('/:id', _.partial(middle.checkValidation, 'general', 'getById'), ctrl.getPostById);

module.exports = router;