 const auth=(req,res,next)=>{
    if(req.session.loggedIn){
        next()
    }else{
        res.redirect("/userLogin")
    }
   }


 const adminAuth=(req,res,next)=>{
    if(req.session.adminIN){
        next()
    }else{
        res.redirect('/admin/adminLogin')
    }
  }

  module.exports={
    auth,
    adminAuth
  }