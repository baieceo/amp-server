/*
 * @Author: your name
 * @Date: 2020-02-20 19:33:45
 * @LastEditTime: 2020-02-20 19:34:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \amp-server\routes\render.js
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
