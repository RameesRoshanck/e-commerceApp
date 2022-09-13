var express = require('express');
const { userHomeRoute, getLogin, getSignUp, postSignUp, postLogin, getOtp, postOtp,
     getConfirmOtp, postConfirmOtp, productView, cartView, checkOut, getProducts,
      addToCart, logout, changeProductQuantity, deleteCartItem} = require('../controllers/userController');
var router = express.Router();
const { auth } = require('../middleware/middleware');

//router path
router.get('/',userHomeRoute)

// signup router
router.get('/userSignUp',getSignUp)
router.post('/userSignUp',postSignUp)

//login router
router.get('/userLogin',getLogin)
router.post('/userLogin',postLogin)

//user logout
router.get('/userLogout',logout)

//login otp router
router.get('/otpLogin',getOtp)
router.post('/otpLogin',postOtp)

//confirm otp router
router.get('/confirmOtp',getConfirmOtp)
router.post('/confirmOtp',postConfirmOtp)

// products page router
router.get('/products',auth,getProducts)

//product in a single page router
router.get('/productView/:id',productView)

// cart page router
router.get('/cart',auth,cartView)

// add to cart in product
router.get('/add-to-cart/:id',addToCart)

//change product quatity
router.post('/change-product-quantity',changeProductQuantity)

//
router.post('/deleteCartItems',deleteCartItem)

// checkout page router
router.get('/checkout',checkOut)

module.exports = router;