"use strict";

const cool = require('cool-ascii-faces');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const path = require('path');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const fileUpload = require('express-fileupload');
const nunjucksDate = require('nunjucks-date');

const session = require('express-session');
const MongoSrore = require('express-sessions');

mongoose.connect('mongodb://nast:nast211192@ds219879.mlab.com:19879/blog');

mongoose.set('debug', true);

mongoose.connection.on('open', () => {
    console.log("Connection establiched");
});

mongoose.connection.on('error', (err) => {
    console.error("Mongoose error:", err);
    process.exit(0);
});

const app = express();

// Configure nunjucks template engine
const env = nunjucks.configure(path.join(__dirname, '..', 'client', 'views'), {
    autoescape: false,
    express: app
});
nunjucksDate.setDefaultFormat('MMMM Do YYYY');
nunjucksDate.install(env);

app.use(favicon(path.join(__dirname, '..', 'client', 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const publicPath = path.join(__dirname, '..', 'client', 'public');
app.use("/public", express.static(publicPath));

//add cookie-session
app.use(session({
    name: 'session',
    secret: "SecretSessionStrng",
    saveUninitialized: false,
    resave: false,

    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    store: new MongoSrore({
        storage: 'mongodb',
        instance: mongoose,
        collection: 'BlogSessions'
    })
}));

// File upload
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    safeFileNames: true,
    preserveExtension: true,
    abortOnLimit: true
}));

require('./router')(app);

app.get('/cool', function(request, response) {
    response.send(cool());
});

app.use(errors());

//error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.messages = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.status(400).send(err.message || err);
});

//socket.io
var server = require('http').Server(app);
const io = require('socket.io')(server, {serveClient: true});

io.on('connection', function (socket) {
   //if authorized socket.join('all');

    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

app.locals.io = io;

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server start on port ", PORT, "env", process.env.NODE_ENV);
});

// module.exports =