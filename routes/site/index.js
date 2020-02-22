/*
 * @Author: your name
 * @Date: 2020-02-16 19:16:15
 * @LastEditTime: 2020-02-22 14:34:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \amp-server\routes\site\index.js
 */
const express = require('express');
const router = express.Router();
const https = require('https');
const fs = require('fs');
const db = require('../../libs/db');
const packageCommon = require('./model/packageCommon');
const packageTypeList = require('./model/packageTypeList');

const packageDetailListPath = __dirname + '/model/packageDetailList.json';

let requestOptions = {

  headers: {
    'Cookie': '_locale=zh-cn; acw_tc=76b20fed15817664240884628e1c679e7efd1e7da09c8e2e5f55c885c8f2ae; ctoken=ix9lBxsVAS36TpDTeJPwhykI; YFD_SESS=-wPxVWuYocZlwoyea8BneA7ybaLYJicGtMCuK3qf_P2SPznoV889quE8gqib9Vbi9KDTbvnX555z_k_KMy3YTJlB0quKL-NNmu5vdFX3iGfFv32to4pp46fGhKLJT4H3cVBVFaPZH5oUckGZKmJb7buVz7zp1MJwhMsm7mj8flLk0l2gUzRzrhGESHQKsMSQcOudgQpqrMTd68hH3gsfmg==; aliyungf_tc=AQAAANlhShezLQoAqOt5e1/eIGJ93/Q7; SERVERID=4316faba76344fa03f154520b639f3ce|1581907620|1581907620',
  }
};

let detailList = fs.readFileSync(packageDetailListPath, {
  encoding: 'utf8',
  flag: 'a+'
});

if (!detailList) {
  detailList = [];
} else {
  detailList = JSON.parse(detailList);
}

const fetchPageListData = async (siteId) => {
  let sqlSyntax = ``;

  sqlSyntax = `
    SELECT id, title, name, page_order, url, is_home_page, is_deleted, site_id
    FROM amp.page_tbl
    WHERE site_id = ? AND is_deleted <> 1
    ORDER BY page_order ASC
  `;

  const results = await db.exec(sqlSyntax, [siteId]);
  const response = {};

  if (results && results.length) {
    response.id = Number(siteId);
    response.page = results.map(row => {
      return {
        siteId: Number(siteId),
        id: row.id,
        name: row.name,
        pageOrder: row.page_order,
        isHomePage: !!row.is_home_page,
        isDeleted: !!row.is_deleted,
        title: row.title,
        url: row.url
      }
    });
  }

  return response;
};

/* 获取页面列表 */
router.get('/:siteId', async (req, res, next) => {
  const response = await fetchPageListData(req.params.siteId);

  res.send(response);
});

/* 获取分类列表接口 */
router.get('/package/type/list', function (req, res, next) {
  res.send(packageTypeList);
});

/* 获取组件列表接口 */
router.get('/package/common', function (req, res, next) {
  const { subType = '' } = req.query;

  if (!subType || subType === 'pkg') {
    res.send(packageCommon);
  } else if (subType) {
    res.send(packageCommon.filter(i => i.subType === subType));
  }
});

/* 获取组件详情接口 */
router.get('/package/common/detail', function (req, res, next) {
  const { pkgId = '' } = req.query;

  if (pkgId) {
    let detail = detailList.find(i => i.packageId === pkgId);

    if (detail) {
      res.send(detail)
    } else {
      requestOptions.hostname = 'api.yunfengdie.com';
      requestOptions.path = `/api/site/package/common/detail?pkgId=${pkgId}`;

      https.get(requestOptions, function (_res) {
        let size = 0;
        let chunks = [];

        _res.on('data', function (chunk) {
          size += chunk.length;
          chunks.push(chunk);
        });

        _res.on('end', function () {
          let buf = Buffer.concat(chunks, size);

          res.json(JSON.parse(buf.toString()));

          detailList.push(JSON.parse(buf.toString()));

          fs.writeFileSync(packageDetailListPath, JSON.stringify(detailList), {
            encoding: 'utf8',
            flat: 'w+'
          });
        });
      });
    }
  } else {
    res.send({});
  }
});

/* 删除页面 */
router.post('/page/remove', async (req, res, next) => {
  const { pageId } = req.body;

  if (pageId !== undefined) {
    let sqlSyntax = ``;

    sqlSyntax = `
      UPDATE amp.page_tbl 
      SET is_deleted = ?
      WHERE id = ?
    `;

    const results = await db.exec(sqlSyntax, [1, pageId]);
    const response = {};

    res.send(response);

    return false;
  } else {
    res.send({});
  }
});

/* 设置默认 */
router.post('/page/default/update', async (req, res, next) => {
  const { siteId, pageId } = req.body;

  if (siteId !== undefined && pageId !== undefined) {
    let sqlSyntax = ``;
    let results = null;

    sqlSyntax = `
      UPDATE amp.page_tbl 
      SET is_home_page = ?
      WHERE site_id = ?
    `;

    results = await db.exec(sqlSyntax, [0, siteId]);

    sqlSyntax = `
      UPDATE amp.page_tbl 
      SET is_home_page = ?
      WHERE id = ?
    `;

    console.log(88888, siteId, pageId);

    results = await db.exec(sqlSyntax, [1, pageId]);

    const response = {
      success: true
    };

    res.send(response);
  } else {
    res.send({});
  }
});

/* 更新页面 */
router.put('/:siteId', async (req, res, next) => {
  const { siteId, data = {} } = req.body;
  const { page = [] } = data;
  let queue = [];

  queue = page.map(row => {
    if (row.id !== undefined) {
      // 更新
      return db.exec(`
        UPDATE amp.page_tbl 
        SET is_deleted = ?, is_home_page = ?, title = ?, name = ?
        WHERE id = ?`,
        [Number(row.isDeleted), Number(row.isHomePage), row.title, row.name, row.id]
      );
    } else {
      // 新建页面
      return db.exec(`
        INSERT INTO amp.page_tbl
        (site_id, name, is_home_page, is_deleted, page_order, title, gmt_create, gmt_modified)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)`,
        [siteId, row.name, Number(row.isHomePage), 0, row.pageOrder, row.title, new Date(), new Date()]
      );
    }
  });

  await Promise.all(queue);

  const response = await fetchPageListData(siteId);

  res.send(response);
});

module.exports = router;
