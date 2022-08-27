var express = require('express');
const { userHomeRoute, getLogin, getSignUp, postSignUp } = require('../controllers/userController');
var router = express.Router();

//router path
router.get('/',userHomeRoute)

router.get('/userSignUp',getSignUp)
router.post('/userSignUp',postSignUp)

router.get('/userLogin',getLogin)


module.exports = router;