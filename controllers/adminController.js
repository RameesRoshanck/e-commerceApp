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
    adminHelpers.adminViewOrder().then((orderlist)=>{
        res.render('admin/admin-orderLiser',{admin:true,orderlist})
    })
}



/* -------------------------------------------------------------------------- */
/*                        get more details product list                       */
/* -------------------------------------------------------------------------- */


const adminOrderDetails=async(req,res)=>{
    let id=req.query.id
    // console.log(id,"hai hao");
    let orderAddress=await adminHelpers.adminViewSingleAddress(id)
    let singleorder=await adminHelpers.adminViewSigleOrder(id)
    let singleTotal=await adminHelpers.adminSingleTotal(id)
    for(var i=0;i<singleorder.length;i++){
        singleorder[i].singleTotal=singleTotal[i].total
    }
    // console.log(orderAddress,"hello");
    // console.log(orderAddress._id,"hai");
    res.render('admin/admin-orderViewDetails',{admin:true,orderAddress,singleorder})
}


/* -------------------------------------------------------------------------- */
/*                      to change order status to shipped                     */
/* -------------------------------------------------------------------------- */

const shippedOrder=(req,res)=>{
    let id = req.query.id;
 adminHelpers.shippedOrder(id).then(()=>{

    res.redirect('/admin/adminOrderList')  
    })
    

}


/* -------------------------------------------------------------------------- */
/*                     to change order status to delivered                    */
/* -------------------------------------------------------------------------- */

const deliverdOrder=(req,res)=>{
    let id = req.query.id;
//   console.log(req.params.id);
  adminHelpers.deliverdOrder(id).then(()=>{
    res.redirect('admin/adminOrderList') 
  })


}


/* -------------------------------------------------------------------------- */
/*                      to change order status to cancle                      */
/* -------------------------------------------------------------------------- */


const cancelOrder=(req,res)=>{
    let id=req.query.id
    adminHelpers.cancelOrder(id).then(()=>{
        res.redirect('/admin/adminOrderList') 
    })
}


/* -------------------------------------------------------------------------- */
/*                              get sales report                              */
/* -------------------------------------------------------------------------- */

const salesReport=(req,res)=>{
    res.render('admin/admin-salesReport',{admin:true})
}


// view day sales report
const daySalesReport=async(req,res)=>{
    // console.log(req.body.day);
    let dt=req.body.day;
    let daySaleslist=await adminHelpers.daySalesReport(dt)
    let sum=0;
    for(let i=0;i<daySaleslist.length;i++){
        sum=sum+daySaleslist[i].quantity
    }
    console.log(sum,"how are you");
    console.log(daySaleslist);
    res.render('admin/admin-daySalesReport',{admin:true,daySaleslist})
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
    adminOrderList,
    adminOrderDetails,
    shippedOrder,
    deliverdOrder,
    cancelOrder,
    salesReport,
    daySalesReport
}