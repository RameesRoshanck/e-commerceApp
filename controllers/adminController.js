const adminHelpers = require("../helpers/adminHelpers");
const userHelpers = require("../helpers/userHelpers");
const multer=require('../helpers/multer')

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
        req.session.loggedIn=false
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
    adminHelpers.getCatagory().then((catagory)=>{
        res.render('admin/admin-addProduct',{admin:true,catagory})
    })
}


const postaddProduct=(req,res)=>{
    console.log(req.files);
    const filename=req.files.map(function(file){
        return file.filename
    })
    req.body.image=filename
   adminHelpers.addProduct(req.body).then((response)=>{
    if(response.status){
        res.redirect('/admin/addProduct')
    }else{
        res.redirect('/admin/addProduct') 
    }
})
}

const listAllProduct=(req,res)=>{
    adminHelpers.listProduct().then((products)=>{
        res.render('admin/admin-allProduct',{admin:true,products})
    })
}

const deleteProduct=(req,res)=>{
    let id=req.params.id
     adminHelpers.deleteProduct(id).then(()=>{
        res.redirect('/admin/listAllProduct') 

     })
}

const getEditProduct=(req,res)=>{
    let id=req.params.id
    adminHelpers.getProductDetails(id).then((product)=>{
       
        res.render('admin/admin-editProduct',{admin:true,product})
    })
}

const updateProduct=(req,res)=>{
    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image=filename
     let id=req.params.id
    adminHelpers.updateProduct(id,req.body).then((data)=>{
        console.log(data);
        res.redirect('/admin/listAllProduct') 
    })
}

  /* -------------------------------------------------------------------------- */
  /*                                  orderlist                                 */
  /* -------------------------------------------------------------------------- */

//get order list
const adminOrderList=(req,res)=>{
    res.render('admin/admin-orderLiser',{admin:true})
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
    postaddProduct,
    listAllProduct,
    deleteProduct,
    getEditProduct,
    updateProduct,
    adminOrderList
}