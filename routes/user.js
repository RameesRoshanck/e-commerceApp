var express = require('express');
const { userHomeRoute, getLogin, getSignUp, postSignUp, postLogin, getOtp, postOtp } = require('../controllers/userController');
var router = express.Router();
var auth=require('../middleware/middleware')

//router path
router.get('/',userHomeRoute)

// signup router
router.get('/userSignUp',getSignUp)
router.post('/userSignUp',postSignUp)

//login router
router.get('/userLogin',getLogin)
router.post('/userLogin',postLogin)

//login otp rputer
router.get('/otpLogin',getOtp)
router.post('/otpLogin',postOtp)

module.exports = router;