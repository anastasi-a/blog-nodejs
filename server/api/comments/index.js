"use strict";

const express = require('express');
const router = express.Router();
const path = require('path');
const ctrl = require('./comments.controller');
const middle = require('../middleware');
const authorization = require('express-rbac');
const _ = require('lodash');

/**
 * @api {post} /comments/:id Add comment to post
 * @apiName addCommentToPost
 * @apiGroup Comments
 * @apiVersion 1.1.0
 *
 * @apiParam {String{2..10000}} text Text of comment
 * @apiParam {Number{1..5}} [rate=3] Rate of post
 * @apiParam {String{24}} [parentId] Id of parent comment
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {String} id  id of the User.
 *
 * @apiSuccessExample Test Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "text": "",
 *       "id": ""
 *     }
 *
 * @apiError {String} message Error message
 *
 * @apiErrorExample Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

//apidoc -i server
//npm i --save-dev mocha chai chai-http

router.use("/public", express.static(path.join(__dirname, '..', '..', '..', 'client', 'public')));

router.post('/:id', authorization.hasPermission("addComment"), _.partial(middle.checkValidation, 'comments', 'addNewComment'), ctrl.addCommentToPost);

router.delete('/:id', ctrl.deleteComment);

router.get('/admin', authorization.hasPermission("show"), ctrl.getCommentsForAdmin);

router.put('/:id', authorization.hasPermission("show"), _.partial(middle.checkValidation, 'comments', 'changeStatus'), ctrl.changeCommentStatus);

module.exports = router;