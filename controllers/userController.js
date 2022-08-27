
const userHomeRoute=(req,res)=>{
    res.render('user/user-home')
    
}

const userSignUp=(req,res)=>{
    res.render('index')
}






module.exports= {
    userHomeRoute,
    userSignUp
}