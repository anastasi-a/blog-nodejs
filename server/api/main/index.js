"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // const user = req.user ? req.user.username : null;
    //
    // res.render('index.nunjucks', {
    //     user: user
    // });
    res.redirect('/posts');
});

module.exports = router;