var express = require('express');
const { userHomeRoute, userSignUp } = require('../controllers/userController');
var router = express.Router();

//router path
router.get('/',userHomeRoute)
router.get('/userSignUp',userSignUp)


module.exports = router;