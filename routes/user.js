var express = require('express');
const { userHomeRoute, getLogin, getSignUp, postSignUp, postLogin, getOtp, postOtp,
     getConfirmOtp, postConfirmOtp, productView, cartView, checkOut, getProducts} = require('../controllers/userController');
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

//confirm otp router
router.get('/confirmOtp',getConfirmOtp)
router.post('/confirmOtp',postConfirmOtp)

// products page router
router.get('/products',getProducts)

//product in a single page router
router.get('/productView/:id',productView)

// cart page router
router.get('/cart',cartView)

// checkout page router
router.get('/checkout',checkOut)

module.exports = router;