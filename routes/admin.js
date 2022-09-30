var express = require('express');
const { adminHomeRoute, admimGetlogin, adminPostlogin, adminLogOut, getaddProduct, postaddProduct,
        getUsers,blockUser, unblockUser, getCatagory, postCatagory, deleteCatagory, listAllProduct, 
        deleteProduct, getEditProduct, updateProduct, adminOrderList, adminOrderDetails,shippedOrder,
        deliverdOrder, cancelOrder, salesReport, daySalesReport, monthlySalesReport, yearllySaleReporter,
        getEditCatagory,postUpdateCatagory,getBanner, addBanner, getSingleBanner, updateBanner, deleteBanner,
        brandOffer, postBrandOffer, getCoupon } = require('../controllers/adminController');
const { adminAuth, auth } = require('../middleware/middleware');
var router = express.Router();
const multer=require("../helpers/multer");



/* -------------------------------------------------------------------------- */
/*                              admin homes route                             */
/* -------------------------------------------------------------------------- */

router.get('/',adminHomeRoute)

router.get('/adminLogin',admimGetlogin)
router.post('/adminLogin',adminPostlogin)

router.get('/adminlogout',adminLogOut)


/* -------------------------------------------------------------------------- */
/*                           admin side user routers                          */
/* -------------------------------------------------------------------------- */

//get all users router
router.get('/admin-users',adminAuth,getUsers);

// block a single user router
router.get('/block-users/:id',blockUser);

// unblock the a sigle user router
router.get('/unblock-user/:id',unblockUser)


/* -------------------------------------------------------------------------- */
/*                         admin side catagory routers                        */
/* -------------------------------------------------------------------------- */

// get catagory page router
router.get('/getCatagory',adminAuth,getCatagory)

// add catagory router
router.post('/addCatagory',multer.array('image',1),postCatagory)

//edit catagory
router.get('/editcatagory/:id',getEditCatagory)
router.post('/editcatagory/:id',multer.array('image',1),postUpdateCatagory)

// delete catagory router
router.get('/deleteCatagory/:id',deleteCatagory)


/* -------------------------------------------------------------------------- */
/*                            admin products routes                           */
/* -------------------------------------------------------------------------- */

router.get('/addProduct',adminAuth,getaddProduct);
router.post('/addProduct',multer.array('image',6),postaddProduct);


router.get("/listAllProduct",adminAuth,listAllProduct)
router.get("/deleteProduct/:id",deleteProduct)

router.get('/editProduct/:id',adminAuth,getEditProduct)
router.post('/editProduct/:id',multer.array('image',6),updateProduct)

/* -------------------------------------------------------------------------- */
/*                                  orderlist                                 */
/* -------------------------------------------------------------------------- */

//get order list
router.get('/adminOrderList',adminAuth,adminOrderList)

//get order details
router.get('/adminOrderDetail',adminAuth,adminOrderDetails)

/* ------------------------- change to order status ------------------------- */

//get order shipped route
router.get('/shippedOrder',adminAuth,shippedOrder)

//get order delivery router
router.get('/deliverOrder',adminAuth,deliverdOrder)

//get order cancled router
router.get('/cancledOrder',adminAuth,cancelOrder)


/* ------------------------------ sales reports ----------------------------- */

//get sales report page totally
router.get('/salesReports',adminAuth,salesReport)

// sale report day in list
router.post('/daysalesreport',adminAuth,daySalesReport)

// sale report in monthly list
router.post('/monthlySales',adminAuth,monthlySalesReport)

// sale report in yearlly
router.post('/yearlySale',adminAuth,yearllySaleReporter)


/* -------------------------------------------------------------------------- */
/*                              Banner management                             */
/* -------------------------------------------------------------------------- */


/* --------------------------- get all banner list -------------------------- */
router.get('/adminBanner',adminAuth,getBanner)

//add banner image
router.post('/addBanner',multer.array('image',2),addBanner)

//get single banner
router.get('/editBanner/:id',adminAuth,getSingleBanner)
router.post('/editBanner/:id',multer.array('image',2),updateBanner)

//delete banner
router.get('/deleteBanner/:id',deleteBanner)


/* -------------------------------------------------------------------------- */
/*                                   offers                                   */
/* -------------------------------------------------------------------------- */



/* -------------------------------- brandwise ------------------------------- */

//get request
router.get('/brandOffer',adminAuth,brandOffer)

//post request
router.post('/brandOffer',adminAuth,postBrandOffer)




/* ----------------------------- //  coupon wise ---------------------------- */

// get request
router.get('/getCoupon',adminAuth,getCoupon)



module.exports = router;