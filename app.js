const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const twitterRouter = require('./routes/auth');
const publishRouter = require('./routes/publish');
const sessions = require('express-session');

const app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/gsm/public/', express.static(path.join(__dirname, 'public')));
app.use('/gsm/node_modules', express.static(__dirname + '/node_modules/'))

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use('/gsm/', indexRouter);
app.use('/gsm/auth', twitterRouter);
app.use('/gsm/publish', publishRouter);

module.exports = app;
