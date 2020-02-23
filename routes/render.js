/*
 * @Author: your name
 * @Date: 2020-02-20 19:33:45
 * @LastEditTime: 2020-02-23 19:39:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \amp-server\routes\render.js
 */
const express = require('express');
const router = express.Router();
const db = require('../libs/db');

/* GET users listing. */
router.post('/', async (req, res, next) => {
  const { siteId, pageId, componentList, data } = req.body;

  let sqlSyntax = ``;

  sqlSyntax = `
    SELECT title
    FROM amp.page_tbl
    WHERE id = ?
  `;

  // 查 title
  const results = await db.exec(sqlSyntax, [pageId]);
  const title = results.length ? results[0].title : '未知页面';

  res.render('render', { title, componentList });
});

module.exports = router;
