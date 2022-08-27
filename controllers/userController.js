
const userHomeRoute=(req,res)=>{
    res.render('user/user-home')
    
}

const getSignUp=(req,res)=>{
    res.render('user/user-SignupPage')
}

const postSignUp=(req,res)=>{

}

const getLogin=(req,res)=>{
    res.render('user/user-loginPage')
}





module.exports= {
    userHomeRoute,
    getSignUp,
    getLogin,
    postSignUp
}