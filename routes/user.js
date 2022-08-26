var express = require('express');
const { userHomeRoute } = require('../controllers/userController');
var router = express.Router();

//router path
router.get('/',userHomeRoute)



module.exports = router;