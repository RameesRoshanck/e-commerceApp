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
    let total=await userHelpers.getTotalAmout(req.session.user._id) 
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
    let total=await userHelpers.getTotalAmout(req.session.user._id) 
    res.render('user/user-placeOrder',{total})
}


// user profile
const userProfile=async(req,res)=>{
    let userDetails=await userHelpers.getuserDetails(req.session.user._id)
    res.render('user/user-profile',{userDetails,user:req.session.user})
}

// user profile add address
const userAddAddress=(req,res)=>{
    res.render('user/user-profileAddAddress')
}

//user profile post add address
const postUserAddAddress=(req,res)=>{
    console.log(req.body);
    userHelpers.addUserAddress(req.session.user._id,req.body)
    res.redirect('/userProfile')
}

// user profile edit address
const editUserAddress=async(req,res)=>{
    let id =req.query.id
   let editAddress=await userHelpers.editUserAddress(id)
    res.render('user/user-editProfileAddress',{editAddress})
}

//user profile update address
const updateUserAddress=(req,res)=>{
    console.log(req.body);
   let id=req.params.id
   userHelpers.updateUserAddress(id,req.body).then((data)=>{
    res.redirect('/userProfile')
   })
}

//user profile delete address
const deleteUserAddress=(req,res)=>{
    let id=req.params.id
    userHelpers.deleteUserAddress(id).then(()=>{
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
    userProfile,
    userAddAddress,
    postUserAddAddress,
    editUserAddress,
    updateUserAddress,
    deleteUserAddress
}