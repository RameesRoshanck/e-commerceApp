var express = require('express');
const { adminHomeRoute, admimGetlogin, adminPostlogin, adminLogOut, getaddProduct, postaddProduct, getUsers,
     blockUser, unblockUser, getCatagory, postCatagory, deleteCatagory, listAllProduct, 
     deleteProduct, getEditProduct, updateProduct, adminOrderList} = require('../controllers/adminController');
const { adminAuth } = require('../middleware/middleware');
var router = express.Router();
const multer=require("../helpers/multer")


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
router.post('/addCatagory',postCatagory)

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

//get oreder list
router.get('/adminOrderList',adminAuth,adminOrderList)

module.exports = router;