var express = require('express');
var router = express.Router();
var packageCommon = require('./model/packageCommon');
var packageTypeList = require('./model/packageTypeList');

/* GET users listing. */
router.get('/package/type/list', function(req, res, next) {
	res.send(packageTypeList);
});

router.get('/package/common', function(req, res, next) {
	const { subType = '' } = req.query;

	console.log(subType);

	if (!subType || subType === 'pkg') {
		res.send(packageCommon);
	} else if (subType) {
		res.send(packageCommon.filter(i => i.subType === subType));
	}
});

module.exports = router;
