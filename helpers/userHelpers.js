const db=require('../config/connection')
const connection=require('../config/collection')
const bcrypt=require('bcrypt')
const otp=require('../config/otpLogin')
const { ObjectId } = require('mongodb')
const client=require('twilio')(otp.accountId,otp.authToken)

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
                let dt=new Date
                userData.date=(dt.getDay()+"/"+dt.getMonth()+"/"+dt.getFullYear())
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
    doOtp:(userData)=>{
        let response={};
        return new Promise(async(resolve,reject)=>{
            let user= await db.get().collection(connection.USER_COLLECTION).findOne({mobile:userData.mobile})
            if(user){
            response.status=true;
            response.user=user;
            client.verify.services(otp.serviceId).verifications.create({ to: `+91${userData.mobile}`, channel: "sms" }).then((verification)=>{})
            //  console.log(response);
             resolve(response)
            }else{
               response.status=false
               resolve(response) 
            }
        })
    },
    doOtpConfirm:(confimrOtp,userData)=>{
        return new Promise((resolve,reject)=>{
            client.verify.services(otp.serviceId).verificationChecks.create({
                to: `+91${userData.mobile}`,
                code: confimrOtp.otp,
              }).then((data)=>{
                if(data.status=='approved'){
                    resolve({status:true})
                }else{
                    resolve({status:false})
                }
              })
        })
    },
    viewProducts:()=>{
        return new Promise((resolve,reject)=>{
           let product= db.get().collection(connection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },
    viewSigleProduct:(proId)=>{
        return new Promise(async(resolve,reject)=>{
          let product=await db.get().collection(connection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)})
          resolve(product) 
        })
    },
    addToCart:(proId,userId)=>{
        let proObj={
            item:ObjectId(proId),
            quantity:1
        }
           return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(connection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=>product.item==proId)
                // console.log(proExist);
                if(proExist!=-1){
                    db.get().collection(connection.CART_COLLECTION).updateOne({'products.item':ObjectId(proId)},{
                        $inc:{'products.$.quantity':1}
                    }).then(()=>{
                        resolve()
                    })
                }else{

                    db.get().collection(connection.CART_COLLECTION).updateOne({user:ObjectId(userId)},
                    {
                    
                           $push:{products:proObj}
                  
                    }).then((result)=>{
                        resolve()
                    })
                }

            }else{
                let cartObj={
                    user:ObjectId(userId),
                    products:[proObj]
                }
                db.get().collection(connection.CART_COLLECTION).insertOne(cartObj).then((data)=>{
                    resolve()
                })
            }
        })
    },
    getCartProduct:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(connection.CART_COLLECTION).aggregate([
                {
                    $match:{user:ObjectId(userId)}
                },
                {
                   $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                        // price:'$products.price'
                    }
                },
                {
                    $lookup:{
                        from:connection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                }
                // {
                //     $lookup:{
                //         from:connection.PRODUCT_COLLECTION,
                //         let:{prodList:"$products"},
                //         pipeline:[
                //             {
                //                 $match:{
                //                     $expr:{
                //                         $in:['$_id','$$prodList']
                //                     }
                //                 }
                //             }
                //         ],
                //         as:"cartItems"
                //     }
                // }
            ]).toArray()
            // console.log(cartItems[0].products);
            resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        let count=0;
        return new Promise(async(resolve,reject)=>{
            let cart= await db.get().collection(connection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(cart){
               count=cart.products.length
            }
            resolve(count)
        })
    }
}