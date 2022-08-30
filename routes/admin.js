var express = require('express');
const { adminHomeRoute, admimGetlogin, adminPostlogin, adminLogOut, getaddProduct, postaddProduct, getUsers, blockUser, unblockUser } = require('../controllers/adminController');
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

router.get('/admin-users',getUsers);

router.get('/admin-users/:id',blockUser);

router.get('/unblock-user/:id',unblockUser)






/* -------------------------------------------------------------------------- */
/*                            admin products routes                           */
/* -------------------------------------------------------------------------- */

router.get('/addProduct',getaddProduct);
router.post('/addProduct',postaddProduct);

module.exports = router;