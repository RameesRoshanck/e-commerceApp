

const adminHomeRoute=(req,res)=>{
    res.render('index',{admin:true})
}


module.exports={
    adminHomeRoute
}