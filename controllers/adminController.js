const adminHelpers = require("../helpers/adminHelpers");
const userHelpers = require("../helpers/userHelpers");
const multer=require('../helpers/multer')


const emailId="ckmhdramees@gmail.com"; //admin login emailId
const passwordId="1234567"              // admin ligin password

                             
 /* -------------------------------------------------------------------------- */
 /*                        admin signup and home section                       */
 /* -------------------------------------------------------------------------- */

// add in home page
const adminHomeRoute=async(req,res)=>{
    if(req.session.adminIN){
     let paymentGrph=await adminHelpers.paymentGraph()
     let sales=await adminHelpers.salesGrph()
    //  console.log(sales,'sales');
     let monthly=await adminHelpers.monthlygrph()
    //  console.log(monthly,'monthly');
     let yearly=await adminHelpers.yearlygrph()
    //  console.log(yearly,'yearly');
        res.render('admin/admin-home',{admin:true,paymentGrph,sales,monthly,yearly})
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
/*                             start with Brand                              */
/* -------------------------------------------------------------------------- */

const getCatagory=(req,res)=>{
    adminHelpers.getCatagory().then((Brand)=>{
        console.log(Brand);
        res.render('admin/admin-catagory',{admin:true,Brand})
    })
}

/* ------------------------------- add brands ------------------------------- */
const postCatagory=(req,res)=>{
    const filename=req.files.map(function(file){
        return file.filename
    })
    req.body.image=filename
  adminHelpers.addCatagory(req.body).then((data)=>{
   res.redirect('/admin/getCatagory')
  })
}

/* ---------------------------- get single brand ---------------------------- */

const getEditCatagory=(req,res)=>{
    let Id=req.params.id
    console.log(req.params.id);
    adminHelpers.editCatagory(Id).then((Brand)=>{
        res.render('admin/admin-editCatagory',{admin:true,Brand})
    })
}

/* ------------------------------ updates Brand ----------------------------- */

const postUpdateCatagory=(req,res)=>{
      
    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image=filename
     let Id=req.params.id
    adminHelpers.updateBrand(Id,req.body).then((data)=>{
        res.redirect('/admin/getCatagory')
    })
}

  


/* ------------------------------ delete Brands ------------------------------ */
const deleteCatagory=(req,res)=>{
    let id=req.params.id
    console.log(id);
   adminHelpers.deleteCatagory(id).then((result)=>{
    res.redirect('/admin/getCatagory')
   })
}


// exports.delet_product = (req, res) => {
//     product.findById(req.params.id).then((result) => {
//       for (let index = 0; index < result.image.length; index++) {
//         const element = result.image[index];
//         fs.unlink("public" + "/Products/" + element, (err) => {
//           if (err) {
//             console.log(err);
//           } else {
//             //console.log ("deleted image of ")
//           }
//         });
//       }
//     });








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



/* --------------------- //get or view sales report page -------------------- */

const salesReport=(req,res)=>{
    res.render('admin/admin-salesReport',{admin:true})
}




/* ------------------------ // view day sales report ------------------------ */

const daySalesReport=async(req,res)=>{
    // console.log(req.body.day);
    let dt=req.body.day;
    let daySaleslist=await adminHelpers.daySalesReport(dt)
    let sum=0;
    for(let i=0;i<daySaleslist.length;i++){
        sum=sum+daySaleslist[i].quantity
    }
   let totalPrice=0
   for(let i=0;i<daySaleslist.length;i++){
    totalPrice=totalPrice+daySaleslist[i].totalAmount   
   }
   console.log(daySaleslist);
    let countOrder=await adminHelpers.countOrder(dt)
    // console.log(countOrder);
    res.render('admin/admin-daySalesReport',{admin:true,daySaleslist,countOrder,sum,totalPrice})
}





/* ---------------------- // view monthly sales report ---------------------- */

const monthlySalesReport=async(req,res)=>{
    let dt=req.body.month;
    let monthSale=await adminHelpers.monthlySalesReport(dt)
    let quantity=0;
    for(let i=0;i<monthSale.length;i++){
         quantity=quantity+monthSale[i].count
    }
 
    let orderCount=0;
    for(let i=0;i<monthSale.length;i++){
         orderCount=orderCount+monthSale[i].total
    }

    let countOrder=await adminHelpers.countOrdermonthly(dt) 
    // console.log(countOrder);

    res.render('admin/admin-monthlySales',{admin:true,monthSale,countOrder,quantity,orderCount})
}


 /* -------------------------- yearlly sales report -------------------------- */

const yearllySaleReporter=async(req,res)=>{
    let dt=req.body.year;
   let yearlySale=await adminHelpers.yearlySales(dt)

   let order=0;
   for(var i=0;i<yearlySale.length;i++){
    order=order+yearlySale[i].count
   }

   let TotalPrice=0;
   for(var i=0;i<yearlySale.length;i++){
    TotalPrice=TotalPrice+yearlySale[i].total
   }

//    console.log(yearlySale);
//    console.log(TotalPrice,'hai hello');
//    console.log(order,'do you know how much i suffer');

let countOrder=await adminHelpers.countOrderYearlly(dt) 
   res.render('admin/admin-yearlySales',{admin:true,yearlySale,order,TotalPrice,countOrder})
}


/* -------------------------------------------------------------------------- */
/*                            end the sales Report                            */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                           start Banner management                          */
/* -------------------------------------------------------------------------- */

const getBanner=(req,res)=>{
    adminHelpers.listBanner().then((Banner)=>{
        res.render('admin/admin-getBanner',{admin:true,Banner})
    })
}


const addBanner=(req,res)=>{
     const filename=req.files.map(function(file){
        return file.filename
    })
    req.body.image=filename
    adminHelpers.addBanner(req.body).then(()=>{
        res.redirect('/admin//adminBanner')
    })
}

const getSingleBanner=(req,res)=>{
    let Id=req.params.id
    adminHelpers.editBanner(Id).then((Banner)=>{
        res.render('admin/admin-editBanner',{admin:true,Banner})
    })
}


const updateBanner=(req,res)=>{
    const filename=req.files.map(function(file){
        return file.filename
    })
    req.body.image=filename
     let bannerId=req.params.id;

     adminHelpers.updateBanner(bannerId,req.body).then((data)=>{
         res.redirect('/admin/adminBanner')
        })
    }

     
const deleteBanner=(req,res)=>{
    let Id=req.params.id
    // console.log(req.params.id,'yavde');
    adminHelpers.deleteBanner(Id).then((data)=>{
        res.redirect('/admin/adminBanner')
    })
}



/* -------------------------------------------------------------------------- */
/*                            start Brandwise offer                           */
/* -------------------------------------------------------------------------- */


const brandOffer=async(req,res)=>{
  let brand= await adminHelpers.getCatagory()
//   console.log(brand);
    res.render('admin/admin-brandOffer',{admin:true,brand})
}


//post brand offer
const postBrandOffer=async(req,res)=>{
    
    let offer=req.body.offer;

    if(req.body.brand !=""){

        let newprice =0;

        let brand=await adminHelpers.addBrandOffer(req.body.brand)
        console.log(brand,'oieuiweort');

         for(let i=0;i<brand.length;i++){
            
             if(brand[i].originelPrice){
                 
                newprice  = Math.round((brand[i].originelPrice) * ((100 - offer) / 100))
               
             }else{
                newprice  = Math.round((brand[i].originalPrice) * ((100 - offer) / 100))
             }
           let BrndOffer=await adminHelpers.updateBrandOffer(brand[i]._id,newprice,offer)
        }
    }

    res.redirect('/admin/brandOffer')
}



/* -------------------------------------------------------------------------- */
/*                              coupon Mangement                              */
/* -------------------------------------------------------------------------- */


const getCoupon=(req,res)=>{

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
    getEditCatagory,
    postUpdateCatagory,
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
    daySalesReport,
    monthlySalesReport,
    yearllySaleReporter,
    getBanner,
    addBanner,
    getSingleBanner,
    updateBanner,
    deleteBanner,
    brandOffer,
    postBrandOffer,
    getCoupon
}