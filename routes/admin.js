var express = require('express');
const { adminHomeRoute } = require('../controllers/adminController');
var router = express.Router();

router.get('/',adminHomeRoute)



module.exports = router;