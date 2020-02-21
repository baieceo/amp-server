/*
 * @Author: your name
 * @Date: 2020-02-16 19:10:48
 * @LastEditTime: 2020-02-21 20:25:01
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \amp-server\app.js
 */
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const db = require('./libs/db');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const siteRouter = require('./routes/site');
const renderRouter = require('./routes/render');

const app = express();

// 初始化数据库
db.init();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  origin: /http:\/\/localhost:\d*$/,
  credentials: true,
  methods: ['GET', 'POST', 'PUT'],
  alloweHeaders: ['Content-Type', 'application/json;charset=utf-8;application/x-www-form-urlencoded']
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/site', siteRouter);
app.use('/api/render', renderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
