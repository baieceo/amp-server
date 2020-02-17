var express = require('express');
var router = express.Router();
var https = require('https');
var fs = require('fs');
var packageCommon = require('./model/packageCommon');
var packageTypeList = require('./model/packageTypeList');

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
