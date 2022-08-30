const adminHelpers = require("../helpers/adminHelpers");
const userHelpers = require("../helpers/userHelpers");

const emailId="ckmhdramees@gmail.com"; //admin login emailId
const passwordId="1234567"              // admin ligin password

                             
 /* -------------------------------------------------------------------------- */
 /*                        admin signup and home section                       */
 /* -------------------------------------------------------------------------- */

// add in home page
const adminHomeRoute=(req,res)=>{
    if(req.session.adminIN){
        res.render('admin/admin-home',{admin:true})
    }else{
        res.redirect('/admin/adminLogin')
    }
        
}


const admimGetlogin=(req,res)=>{
    if(req.session.adminIN){
        res.redirect('/admin/')
    }else{
        res.render('admin/admin-login',{admin:true})
    }
}



const adminPostlogin=(req,res)=>{
    const {email,password}=req.body;
    if(email==emailId && password==passwordId){
        req.session.adminIN=true
        res.redirect('/admin/')
    }else{
        res.redirect('/admin/adminLogin')
    }
}

const adminLogOut=(req,res)=>{
   req.session.adminIN=false;
   res.redirect('/admin/adminLogin')
}

/* -------------------------------------------------------------------------- */
/*                         admin side user controllers                        */
/* -------------------------------------------------------------------------- */


//get all user details
const getUsers=(req,res)=>{
    adminHelpers.getAllUsers().then((users)=>{
        res.render('admin/admin-userTable',{admin:true,users})
    })
}

//block a single user
const blockUser=(req,res)=>{
    let proId=req.params.id
    adminHelpers.blockUser(proId).then((data)=>{
        res.redirect('/admin/admin-users')
    })
}

//unblock a single user
const unblockUser=(req,res)=>{
  let proId=req.params.id;
  adminHelpers.unblockUser(proId).then((data)=>{
    res.redirect('/admin/admin-users')
  })
}

/* -------------------------------------------------------------------------- */
/*                             start with catagory                            */
/* -------------------------------------------------------------------------- */

const getCatagory=(req,res)=>{
    adminHelpers.getCatagory().then((catagory)=>{
        res.render('admin/admin-catagory',{admin:true,catagory})
    })
}


const postCatagory=(req,res)=>{
  adminHelpers.addCatagory(req.body).then(()=>{
    res.redirect('/admin/getCatagory')
  })
}

const deleteCatagory=(req,res)=>{
    let id=req.params.id
    console.log(id);
   adminHelpers.deleteCatagory(id).then(()=>{
    res.redirect('/admin/getCatagory')
   })
}



 /* -------------------------------------------------------------------------- */
 /*                  start the products controllers                            */
 /* -------------------------------------------------------------------------- */

const getaddProduct=(req,res)=>{
    res.render('admin/admin-addProduct')
}

const postaddProduct=(req,res)=>{
   
}

module.exports={
    adminHomeRoute,
    admimGetlogin,
    adminPostlogin,
    adminLogOut,
    getUsers,
    blockUser,
    unblockUser,
    getCatagory,
    postCatagory,
    deleteCatagory,
    getaddProduct,
    postaddProduct
}