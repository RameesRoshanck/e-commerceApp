const { response } = require("express")
const express = require("express")
const userHelpers = require("../helpers/userHelpers")

// user home page
const userHomeRoute=(req,res)=>{
    userHelpers.viewProducts().then((product)=>{
        res.render('user/user-home',{product})
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
        req.session.mobile=req.body.mobile
        res.redirect('/userSignUp')
      }else if (response.mobileExist){
        req.session.mobileExist=true
        res.redirect('/userSignUp')
      }else{
          res.redirect('/')
        }
    })
}


const getLogin=(req,res)=>{
    if(req.session.loggedIn){
        res.redirect('/')
    }else{
        res.render('user/user-loginPage')
    }

}

const postLogin=(req,res)=>{
  console.log(req.body);
     userHelpers.doLogin(req.body).then((response)=>{
        if(response.status){
            req.session.loggedIn=true
            req.session.user=response.user
            res.redirect('/')
        }else{
       res.redirect('/userLogin')
        }
     })
}


const getOtp=(req,res)=>{
    if(req.session.loggedIn){
        res.redirect('/') 
    }else{
        res.render('user/user-otp') 
    }
}


let signUpData;
const postOtp=(req,res)=>{
    userHelpers.doOtp(req.body).then((response)=>{
        if(response.status){
            signUpData=response.user
            res.redirect('/confirmOtp')
        }else{
            res.redirect('/otpLogin')
        }
    })
}


const getConfirmOtp=(req,res)=>{
    if(req.session.loggedIn){
        res.redirect('/') 
    }else{
    res.render('user/user-confirmOtp')
    }
}

const postConfirmOtp=(req,res)=>{
  userHelpers.doOtpConfirm(req.body,signUpData).then((response)=>{
    if(response.status){
        req.session.loggedIn=true
        res.redirect('/')
    }else{
        res.redirect('/confirmOtp')
    }
  })
}

const getProducts=(req,res)=>{
     res.render('user/user-products')
}




const productView=(req,res)=>{
    let id=req.params.id
    userHelpers.viewSigleProduct(id).then((product)=>{
        res.render('user/user-productView',{product})
    })
}


const cartView=(req,res)=>{
    res.render('user/user-cart.hbs')
}

const checkOut=(req,res)=>{
    res.render('user/user-checkout')
}


module.exports= {
    userHomeRoute,
    getSignUp,
    getLogin,
    postSignUp,
    postLogin,
    getOtp,
    postOtp,
    getConfirmOtp,
    postConfirmOtp,
    getProducts,
    productView,
    cartView,
    checkOut
}