var express = require('express');
const { userHomeRoute, getLogin, getSignUp, postSignUp, postLogin, getOtp,
        postOtp,  getConfirmOtp, postConfirmOtp, productView, cartView,
        getProducts,addToCart, logout, changeProductQuantity, deleteCartItem,
        placeOrder,userProfile, userAddAddress, postUserAddAddress, editUserAddress,
        updateUserAddress,deleteUserAddress, getAddPlaceOrderAddress, postAddPlaceOrderAddress,
        postPlaceOrder,orderSuccess, orderDetails, orderMoreDetails, varifyPayment, paypalSuccess,
        getwishlist,addWishlist, deleteWishlist} = require('../controllers/userController');
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
router.get('/add-to-cart/:id',auth,addToCart)

//change product quatity
router.post('/change-product-quantity',auth,changeProductQuantity)

// delete cart product items
router.post('/deleteCartItems',auth,deleteCartItem)

// checkout page get & post router
router.get('/placeOrder',auth,placeOrder)
router.post('/placeOrder',auth,postPlaceOrder)


// razorpay varify-payment router
router.post('/varify-payment',auth,varifyPayment)



//checkout add user address
router.get('/AddPlaceOrderAddress',auth,getAddPlaceOrderAddress)
router.post('/AddPlaceOrderAddress',auth,postAddPlaceOrderAddress)


//order succes in paypal
router.get('/paypalsuccess/:id',auth,paypalSuccess)

// order success page
router.get('/orderSuccess',auth,orderSuccess)

//oders list
router.get('/odersList',auth,orderDetails)

//order more details
router.get('/viewOrderDetails',auth,orderMoreDetails)




//user profile router
router.get('/userProfile',auth,userProfile)

//user profile get add address
router.get('/addAddress',auth,userAddAddress)
router.post('/addAddress',auth,postUserAddAddress)

//user edit profile address
router.get('/editUserAddress',auth,editUserAddress)
router.post('/editUserAddress/:id',auth,updateUserAddress)

//user delete profile address
router.get('/deleteUserAddress',auth,deleteUserAddress)



/* -------------------------------- wishlist -------------------------------- */

//get wishlist
router.get('/wishlist',auth,getwishlist)

//add a product to wishlist
router.get('/add-to-wishlist/:id',addWishlist)

//delete wish list
router.post('/deleteWishlist',deleteWishlist)


module.exports = router;