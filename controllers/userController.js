const { response } = require("express")
const express = require("express")
const userHelpers = require("../helpers/userHelpers")

// user home page
const userHomeRoute=async(req,res)=>{
    let user=req.session.user
    let cartCount=null;
    if(req.session.loggedIn){

        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    userHelpers.viewProducts().then((product)=>{
        // console.log(user)
        res.render('user/user-home',{product,user,cartCount})
    })
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
     //    console.log(req.body);
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


//user getotp
const getOtp=(req,res)=>{
        res.render('user/user-otp',{"blockedOtp": req.session.Blocked}) 
        req.session.Blocked=false
    }


//user postotp
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


//user get confirm otp
const getConfirmOtp=(req,res)=>{
    res.render('user/user-confirmOtp',{"otpErr":req.session.otpErr})
    req.session.otpErr=false
}


//user post confirm otp
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


//get product
const getProducts=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    userHelpers.viewProducts().then((product)=>{
     res.render('user/user-products',{product,user:req.session.user,cartCount})
    })
}



//user product view
const productView=(req,res)=>{
    let id=req.params.id
    userHelpers.viewSigleProduct(id).then((product)=>{
        res.render('user/user-productView',{product,user:req.session.user})
    })
}


// user cart view
const cartView=async(req,res)=>{
    let cartCount=null;
    if(req.session.loggedIn){
        cartCount= await userHelpers.getCartCount(req.session.user._id)
    }
    let products= await userHelpers.getCartProduct(req.session.user._id)
    let total=0
    if(products.length>0){
         total=await userHelpers.getTotalAmout(req.session.user._id) 
    }
    let productTotal=await userHelpers.getProductTotal(req.session.user._id)
    for(var i=0;i<products.length;i++){
        products[i].productTotal=productTotal[i].total
    }
    res.render('user/user-cart',{products,total,cartCount,user:req.session.user})
}


// add to cart
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
     userHelpers.placeOrder(req.body,req.body.address,product,totalPrice).then((orderId)=>{
        console.log(req.body.Payment);
        if(req.body['Payment']==='cod'){
            res.json({codSuccess:true})
        }else if(req.body['Payment']==='razorpay'){
          userHelpers.generateRazorepy(orderId,totalPrice).then((response)=>{
              response.razorpay=true
                res.json(response)
          })
        }else{
            console.log("error");
        }

        })
    } 

const varifyPayment=(req,res)=>{
     console.log(req.body);
     userHelpers.verifyPayment(req.body).then(()=>{
        userHelpers.ChangePaymentStatus(req.body.order.receipt).then(()=>{
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




 
//order sucdess page
const orderSuccess=(req,res)=>{
    res.render('user/user-orderSuccess',{user:req.session.user})
}

//orders list page
const orderDetails=async(req,res)=>{
    let order=await userHelpers.getUserOders(req.session.user._id)   
    res.render('user/user-ordersList',{user:req.session.user,order})
}

//order more details
const orderMoreDetails=async(req,res)=>{
    // console.log(req.query.id);
    let order=await userHelpers.getOrderDetails(req.query.id)
    res.render('user/user-orderMoreDetails',{order,user:req.session.user})
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
    console.log(req.body);
   let id=req.params.id
   userHelpers.updateUserAddress(id,req.session.user._id,req.body).then((data)=>{
    res.redirect('/userProfile')
   })
}

//user profile delete address
const deleteUserAddress=(req,res)=>{
    let id=req.params.id
    console.log(id);
    userHelpers.deleteProfileAddress(id,req.session.user._id).then(()=>{
        res.redirect('/userProfile')
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
    orderSuccess,
    orderDetails,
    orderMoreDetails,
    userProfile,
    userAddAddress,
    postUserAddAddress,
    editUserAddress,
    updateUserAddress,
    deleteUserAddress
}