var express = require('express');
const { userHomeRoute, getLogin, getSignUp, postSignUp, postLogin, getOtp,
        postOtp,  getConfirmOtp, postConfirmOtp, productView, cartView,
        getProducts,addToCart, logout, changeProductQuantity, deleteCartItem,
        placeOrder,userProfile, userAddAddress, postUserAddAddress, editUserAddress,
         updateUserAddress, deleteUserAddress} = require('../controllers/userController');
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

// delete cart product items
router.post('/deleteCartItems',deleteCartItem)

// checkout page router
router.get('/placeOrder',auth,placeOrder)

//user profile router
router.get('/userProfile',auth,userProfile)

//user profile get add address
router.get('/addAddress',auth,userAddAddress)

// user profile post add address
router.post('/addAddress',auth,postUserAddAddress)

//user edit profile address
router.get('/editUserAddress',auth,editUserAddress)
router.post('/editUserAddress/:id',auth,updateUserAddress)

//user delete profile address
router.delete('/deleteUserAddress/:id',auth,deleteUserAddress)

module.exports = router;