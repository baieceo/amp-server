/*
 * @Author: your name
 * @Date: 2020-02-20 19:33:45
 * @LastEditTime: 2020-02-24 16:13:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \amp-server\routes\render.js
 */
const express = require('express');
const router = express.Router();
const db = require('../libs/db');
const ejs = require('ejs');

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

  // res.render('render', { title, componentList });

  ejs.renderFile(__dirname + '../../views/render.ejs', { title, componentList }, {}, function(err, str){
    if (err) {
      res.send(err);

      return false;
    }
    
    res.send({
      html: str
    });
  });
});

module.exports = router;
