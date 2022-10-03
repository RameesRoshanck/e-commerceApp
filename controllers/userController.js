// const { response } = require("express")
const { response } = require("express");
const express = require("express")
const userHelpers = require("../helpers/userHelpers")

// user home page
const userHomeRoute=async(req,res)=>{
    let user=req.session.user
    let cartCount=null;
    let wishlistCount=null;
    if(req.session.loggedIn){

        cartCount= await userHelpers.getCartCount(req.session.user._id)
        wishlistCount= await userHelpers.getWishlistCount(req.session.user._id)
    }
        let product=await userHelpers.viewProducts()
        // console.log(product);
        let brand=await userHelpers.viewbrand()
        let banner=await userHelpers.viewBanner()
        // console.log(user)
        res.render('user/user-home',{product,brand,banner,user,cartCount,wishlistCount})
    
}

    

//user get signup
const getSignUp=(req,res)=>{
    res.render('user/user-SignupPage',{"emailErr":req.session.emailExist,"mobileErr":req.session.mobileExist,"emailExiist":req.session.email,"mobileExist":req.session.mobile})
    req.session.emailExist=false
    req.session.mobileExist=false
    req.session.email=""
    req.session.mobile=""
}

//user post signup
const postSignUp=(req,res)=>{
        console.log(req.body);
     userHelpers.doSignup(req.body).then((response)=>{
      if(response.emailExist){
        req.session.emailExist=true;
        req.session.email=req.body.email
        res.redirect('/userSignUp')
      }else if (response.mobileExist){
        req.session.mobileExist=true
        req.session.mobile=req.body.mobile
        res.redirect('/userSignUp')
      }else{
          res.redirect('/')
        }
    })
}


//user get login
const getLogin=(req,res)=>{
    if(req.session.loggedIn){
        res.redirect('/')
    }else{
        res.render('user/user-loginPage',{"logedErr":req.session.loggedErr})
        req.session.loggedErr=false
    }

}


//user post login
const postLogin=(req,res)=>{
//   console.log(req.body);
     userHelpers.doLogin(req.body).then((response)=>{
        if(response.status){
            req.session.loggedIn=true
            req.session.user=response.user
            res.redirect('/')
        }else{
            req.session.loggedErr=true
       res.redirect('/userLogin')
        }
     })
}


// user logout
const logout=(req,res)=>{
    req.session.loggedIn=false
    req.session.user=null;
    res.redirect('/')
}


/* ------------------------------ //user getotp ----------------------------- */


const getOtp=(req,res)=>{
        res.render('user/user-otp',{"blockedOtp": req.session.Blocked}) 
        req.session.Blocked=false
    }


/* ------------------------------ user postotp ------------------------------ */


let signUpData;
const postOtp=(req,res)=>{
    userHelpers.doOtp(req.body).then((response)=>{
        if(response.status){
            signUpData=response.user
            res.redirect('/confirmOtp')
        }else{
            req.session.Blocked=true
            res.redirect('/otpLogin')
        }
    })
}



/* ------------------------- //user get confirm otp ------------------------- */


const getConfirmOtp=(req,res)=>{
    res.render('user/user-confirmOtp',{"otpErr":req.session.otpErr})
    req.session.otpErr=false
}


/* ------------------------- //user post confirm otp ------------------------ */


const postConfirmOtp=(req,res)=>{
  userHelpers.doOtpConfirm(req.body,signUpData).then((response)=>{
    if(response.status){
        req.session.loggedIn=true
        req.session.user=signUpData
        res.redirect('/')
    }else{
        req.session.otpErr=true
        res.redirect('/confirmOtp')
    }
  })
}


/* ------------------------------ //get product ----------------------------- */


const getProducts=async(req,res)=>{
    let cartCount=null;
    let wishlistCount=null
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
        wishlistCount= await userHelpers.getWishlistCount(req.session.user._id)
    }
    userHelpers.viewProducts().then((product)=>{
     res.render('user/user-products',{product,user:req.session.user,cartCount,wishlistCount})
    })
}



/* --------------------------- //user product view -------------------------- */


const productView=async(req,res)=>{
    let cartCount=null;
    let wishlistCount=null
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
        wishlistCount= await userHelpers.getWishlistCount(req.session.user._id)
    }
    let id=req.params.id
    userHelpers.viewSigleProduct(id).then((product)=>{
        res.render('user/user-productView',{product,user:req.session.user,cartCount,wishlistCount})
    })
}


/* -------------------- //user catagorywise product view -------------------- */


const catagoryView=async(req,res)=>{
        //  console.log(req.query.id,'query');
        let cartCount=null;
        let wishlistCount=null
        if(req.session.loggedIn){
            cartCount= await userHelpers.getCartCount(req.session.user._id)
            wishlistCount= await userHelpers.getWishlistCount(req.session.user._id)
        }
        let Id=req.query.id;
        await userHelpers.brandView(Id).then(async(brandss)=>{
            let brand=await userHelpers.viewbrand()
            // console.log(brandss,"only brand wise");
            res.render('user/user-categorybase',{brandss,brand,user:req.session.user,cartCount,wishlistCount})
        })
    }




/* ---------------------------- // user cart view --------------------------- */


const cartView=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    let products= await userHelpers.getCartProduct(req.session.user._id)
    //  console.log(products);
    
    let total=null;
    if(products.length>0){
        total=await userHelpers.getTotalAmout(req.session.user._id) 
    }
    let productTotal=await userHelpers.getProductTotal(req.session.user._id)
    for(var i=0;i<products.length;i++){
        products[i].productTotal=productTotal[i].total
    }
    //  console.log(total,"total");
    //  console.log(products,"prototal");
    res.render('user/user-cart',{products,total,cartCount,user:req.session.user})
}




/* ----------------------------- // add to cart ----------------------------- */
const addToCart=(req,res)=>{
    // console.log("api call");
    userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
        //  res.redirect('/products')
        res.json({status:true})
    })
}


// change quantity
const changeProductQuantity=(req,res,next)=>{
    let response={}
    // console.log(req.body);
    userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total=await userHelpers.getTotalAmout(req.body.user)
    response.proTotal= await userHelpers.getSubTotal(req.body) 
       res.json(response) 
    })
}


//delete cart
const deleteCartItem=(req,res)=>{
     userHelpers.DeleteCartItem(req.body).then((response)=>{
        res.json(response)
     })
}

//user placeorder page
const placeOrder=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    let userDetails=await userHelpers.getuserDetails(req.session.user._id)
    let products= await userHelpers.getCartProduct(req.session.user._id)
    let total=0
    if(products.length>0){
     total=await userHelpers.getTotalAmout(req.session.user._id)
    }
    let productTotal=await userHelpers.getProductTotal(req.session.user._id)
    for(var i=0;i<products.length;i++){
        products[i].productTotal=productTotal[i].total
    }
    res.render('user/user-placeOrder',{total,products,userDetails,cartCount,user:req.session.user})
}

//user post placeOrder page
const postPlaceOrder=async(req,res)=>{

 
    let product=await userHelpers.getCartProductList(req.body.userId)
    let totalPrice=await userHelpers.getTotalAmout(req.body.userId)
    let Coupon =await userHelpers.CheckoutCoupon(req.body.couponCode)

    if(Coupon){
       let discountAmount=(totalPrice*parseInt(Coupon.offer)/100)
        let amount=Math.round(totalPrice-discountAmount)
        // console.log(amount,'amount');

        if(req.body['Payment']==='cod')
        {
            userHelpers.placeOrder(req.body,req.body.address,product,amount).then((orderId)=>{
            res.json({codSuccess:true})
            })
        }
        else if(req.body['Payment']==='razorpay')
        {
            userHelpers.onlinePayment(req.body,req.body.address,product,amount).then((orderId)=>{
                userHelpers.generateRazorepy(orderId,amount).then((response)=>{
                    response.razorpay=true
                    res.json(response)
                })
            })
        }
        else if(req.body['Payment']==='paypal')
        {
            userHelpers.onlinePayment(req.body,req.body.address,product,amount).then((orderId)=>{
                userHelpers.generatePaypal(orderId,amount).then((response)=>{
                    response.paypal=true
                    // console.log(response.paypal,'sdfsadfsdfsdf');
                    res.json(response)
                })
            })
        }

    }else{

        if(req.body['Payment']==='cod')
        {
            userHelpers.placeOrder(req.body,req.body.address,product,totalPrice).then((orderId)=>{
            res.json({codSuccess:true})
            })
        }
        else if(req.body['Payment']==='razorpay')
        {
            userHelpers.onlinePayment(req.body,req.body.address,product,totalPrice).then((orderId)=>{
                userHelpers.generateRazorepy(orderId,totalPrice).then((response)=>{
                    response.razorpay=true
                    res.json(response)
                })
            })
        }
        else if(req.body['Payment']==='paypal')
        {
            userHelpers.onlinePayment(req.body,req.body.address,product,totalPrice).then((orderId)=>{
                userHelpers.generatePaypal(orderId,totalPrice).then((response)=>{
                    response.paypal=true
                    // console.log(response.paypal,'sdfsadfsdfsdf');
                    res.json(response)
                })
            })
        }
    }
} 



    // const postPlaceOrder=async(req,res)=>{
    //     let product=await userHelpers.getCartProductList(req.body.userId)
    //     let totalPrice=await userHelpers.getTotalAmout(req.body.userId)
    //      userHelpers.placeOrder(req.body,req.body.address,product,totalPrice).then((orderId)=>{
    //         // console.log(req.body.Payment);
    //         if(req.body['Payment']==='cod'){
    //             res.json({codSuccess:true})
    //         }else if(req.body['Payment']==='razorpay'){
    //           userHelpers.generateRazorepy(orderId,totalPrice).then((response)=>{
    //               response.razorpay=true
    //                 res.json(response)
    //           })
    //         }else if(req.body['Payment']==='paypal'){
    //             userHelpers.generatePaypal(orderId,totalPrice).then((response)=>{
    //                 response.paypal=true
    //                 console.log(response.paypal,'sdfsadfsdfsdf');
    //                 res.json(response)
    //             })
    //         }
    
    //         })
    //     } 















const varifyPayment=(req,res)=>{
    //  console.log(req.body,"hai hello");
     userHelpers.verifyPayment(req.body).then(()=>{
        userHelpers.ChangePaymentStatus(req.body.order.receipt,req.session.user._id).then(()=>{

            console.log('payment is successfull');
            res.json({status:true})
        })
     }).catch((err)=>{
        console.log(err);
        res.json({status:false})
     })
}











//add address place order  page get
const getAddPlaceOrderAddress=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    res.render('user/user-addPlaceOrderAddress',{cartCount,user:req.session.user})
}


//post add place order address
const postAddPlaceOrderAddress=(req,res)=>{
    userHelpers.addUserAddress(req.session.user._id,req.body).then(()=>{
        res.redirect('/placeOrder')
    })
}



//pay pal order success
const paypalSuccess=(req,res)=>{
    // console.log(req.params.id,"order id");
    let orderId=req.params.id;
    userHelpers.ChangePaymentStatus(orderId,req.session.user._id).then(()=>{

        console.log('payment is successfull');
        res.redirect('/orderSuccess')
    })
}



 
//order success page
const orderSuccess=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    
    res.render('user/user-orderSuccess',{user:req.session.user,cartCount})

}

//orders list page
const orderDetails=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    let order=await userHelpers.getUserOders(req.session.user._id)   
    res.render('user/user-ordersList',{user:req.session.user,order,cartCount})
}

//order more details
const orderMoreDetails=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    // console.log(req.query.id);
    let order=await userHelpers.getOrderDetails(req.query.id)
    res.render('user/user-orderMoreDetails',{order,user:req.session.user,cartCount})
}








// user profile
const userProfile=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    let userDetails=await userHelpers.getuserDetails(req.session.user._id)
    res.render('user/user-profile',{userDetails,cartCount,user:req.session.user})
}

// user profile add address
const userAddAddress=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    res.render('user/user-profileAddAddress',{cartCount,user:req.session.user})
}

//user profile post add address
const postUserAddAddress=(req,res)=>{
    console.log(req.body);
    userHelpers.addUserAddress(req.session.user._id,req.body).then(()=>{
        res.redirect('/userProfile')
    })
}


// user profile edit address
const editUserAddress=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    let id =req.query.id
  userHelpers.editUserAddress(id,req.session.user._id).then((editAddress)=>{
      res.render('user/user-editProfileAddress',{editAddress,cartCount,user:req.session.user})
    })
}


//user profile update address
const updateUserAddress=(req,res)=>{
    // console.log(req.body);
   let id=req.params.id
   userHelpers.updateUserAddress(id,req.session.user._id,req.body).then((data)=>{
    res.redirect('/userProfile')
   })
}

//user profile delete address
const deleteUserAddress=(req,res)=>{
    let id=req.params.id
    // console.log(id);
    userHelpers.deleteProfileAddress(id,req.session.user._id).then(()=>{
        res.redirect('/userProfile')
    })
}







/* -------------------------------------------------------------------------- */
/*                                  wishlist                                  */
/* -------------------------------------------------------------------------- */


const getwishlist=async(req,res)=>{
    let wishList=await userHelpers.getWishlist(req.session.user._id)
    // console.log(wishList);
    res.render('user/user-wishlist',{wishList})
}


const addWishlist=(req,res)=>{
    // console.log(req.query.id,'hai how');
    let Id=req.params.id
    userHelpers.addToWishlist(Id,req.session.user._id).then((response)=>{
        // res.redirect('/products')
        res.json(response)
    })
}


const deleteWishlist=(req,res)=>{
    // console.log(req.body);
   userHelpers.DeleteWishlist(req.body).then((response)=>{
    res.json(response)
   })
}

/* -------------------------- end wishlist controls ------------------------- */


/* ------------------------------ applay coupon ----------------------------- */


const applayCoupon=async(req,res)=>{
     let user=req.session.user._id

    let total=await userHelpers.getTotalAmout(user)
    const date=new Date()


   if(req.body.coupon==null){
       
      res.json({noCoupon:true,total})
     }else{

    let applayCoupon= await userHelpers.applayCoupon(req.body,user,date,total)
    // console.log(applayCoupon,'applay responce');
    if(applayCoupon.varifying){
      
        // console.log(total);
        
             let discountAmount=(total*parseInt(applayCoupon.Data.offer)/100)
             let amount=total-discountAmount
             applayCoupon.subAmount=Math.round(discountAmount)
             applayCoupon.TotalAmount=Math.round(amount)

            //  console.log(TotalAmount,'offer');

            res.json(applayCoupon)
    }else{
        console.log(total);
        applayCoupon.Total=total
        res.json(applayCoupon)
    }
   }

}


/* ------------------------------ Remove coupon ----------------------------- */

const RemoveCoupon=(req,res)=>{
    let user=req.session.user._id
     
     userHelpers.getTotalAmout(user).then((response)=>{
         res.json(response)
        })
    }

     








module.exports= {
    userHomeRoute,
    getSignUp,
    getLogin,
    postSignUp,
    postLogin,
    logout,
    getOtp,
    postOtp,
    getConfirmOtp,
    postConfirmOtp,
    getProducts,
    catagoryView,
    productView,
    cartView,
    addToCart,
    changeProductQuantity,
    deleteCartItem,
    placeOrder,
    postPlaceOrder,
    varifyPayment,
    getAddPlaceOrderAddress,
    postAddPlaceOrderAddress,
    paypalSuccess,
    orderSuccess,
    orderDetails,
    orderMoreDetails,
    userProfile,
    userAddAddress,
    postUserAddAddress,
    editUserAddress,
    updateUserAddress,
    deleteUserAddress,
    getwishlist,
    addWishlist,
    deleteWishlist,
    applayCoupon,
    RemoveCoupon
   
}