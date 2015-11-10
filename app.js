var VIEW_DEBUG = true;


var DEV_DEBUG = true;


var TEST_RELEASE = false;


var PREVIEW_RELEASE = false;

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var session = require('express-session');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var viewPath = '/release_views';
var bodyParser = require('body-parser');
var route = require('./route');

app.use(bodyParser.json({strict: false}));
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', __dirname + viewPath);
app.set('view engine', 'ejs');
app.use(cookieParser('mescakemobile'));
app.use(session({
    secret: 'mescakemobile',
    resave: false,
    saveUninitialized: false,
    proxy: false // if you do SSL outside of node.
}));
app.use(compression({
    threshold: 1024
}));

// static resources
app.use(express.static(path.join(__dirname, '/web')));


var RES_SUCCESS = 0;
var RES_FAIL = 1;
var STATIC_DOMAIN = 'http://s1.static.mescake.com/';
var IMG_DOMAIN = 'http://touch.mescake.com/';

if (VIEW_DEBUG) {
    viewPath = '/views';
    app.set('views', __dirname + viewPath);
}

if (DEV_DEBUG) {
    STATIC_DOMAIN = 'http://localhost/';
    IMG_DOMAIN = 'http://localhost/img/';
}

if (TEST_RELEASE) {
    STATIC_DOMAIN = 'http://static.n.mescake.com/';
}

if (PREVIEW_RELEASE) {
    STATIC_DOMAIN = 'http://static.preview.mescake.com/';
    IMG_DOMAIN = 'http://touch.n.mescake.com/';
}

route(app);

module.exports = app;

