var express = require('express');
const { adminHomeRoute, admimGetlogin, adminPostlogin, adminLogOut, getaddProduct, postaddProduct, getUsers, blockUser, unblockUser, getCatagory, postCatagory, deleteCatagory } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/middleware');
var router = express.Router();


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

router.get('/getCatagory',adminAuth,getCatagory)

router.post('/addCatagory',postCatagory)

router.get('/deleteCatagory/:id',deleteCatagory)


/* -------------------------------------------------------------------------- */
/*                            admin products routes                           */
/* -------------------------------------------------------------------------- */

router.get('/addProduct',getaddProduct);
router.post('/addProduct',postaddProduct);

module.exports = router;