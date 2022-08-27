const db=require('../config/connection')
const connection=require('../config/collection')
const bcrypt=require('bcrypt')

module.exports={
    doSignup:(userData)=>{
        console.log(userData);
        return new Promise(async(resolve,reject)=>{
            let response={}
            const email=await db.get().collection(connection.USER_COLLECTION).findOne({email:userData.email})
            const mobile=await db.get().collection(connection.USER_COLLECTION).findOne({mobile:userData.mobile})
            if(email){
                response.emailExist=true
                resolve(response)
            }else if(mobile){
                response.mobileExist=true
                resolve(response)
            }else{
               userData.password=await bcrypt.hash(userData.password,10)
               db.get().collection(connection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data)
               })
            }
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            const user= await db.get().collection(connection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("login succed");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login failes");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("email incorect");
                resolve({status:false})
            }
        })
    },
    doOtpLogin:(userData)=>{
        let response={};
        return new Promise(async(resolve,reject)=>{
            let mobile= await db.get().collection(connection.USER_COLLECTION).findOne({mobile:userData.mobile})
            if(!mobile){
                response.mobileExist=true
                reject(response)
            }else{
                
            }
        })
    }
}