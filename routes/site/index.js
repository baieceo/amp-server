/*
 * @Author: your name
 * @Date: 2020-02-16 19:16:15
 * @LastEditTime: 2020-02-20 21:54:57
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

/* 获取页面列表 */
router.get('/:siteId', async (req, res, next) => {
  const { siteId } = req.params;

  let sqlSyntax = ``

  sqlSyntax = `
    SELECT id, title, site_id
    FROM amp.page_tbl
    WHERE site_id = ${siteId}
  `

  const results = await db.exec(sqlSyntax)
  const response = {}

  if (results && results.length) {
    response.id = siteId
    response.page = results.map(row => {
      return {
        id: row.id,
        siteId,
        title: row.title
      }
    })

    res.send(response)

    return false
  }

  res.send(response)
})

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

module.exports = router;
