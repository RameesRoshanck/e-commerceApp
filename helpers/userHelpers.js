const db=require('../config/connection')
const connection=require('../config/collection')
const bcrypt=require('bcrypt')
const otp=require('../config/otpLogin')
const { ObjectId } = require('mongodb')
const { response } = require('express')
const client=require('twilio')(otp.accountId,otp.authToken)
const Razorpay = require('razorpay');
const e = require('express')
const { resolve } = require('path')
var paypal = require('paypal-rest-sdk');

//instence key in razorepay
var instance = new Razorpay({
    key_id: 'rzp_test_jwBOFeIIltMxLW',
    key_secret: 'ZrCRgxXVvyEVFG9zxAIMRoX6',
  }); 


//  paypal configure
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AfJRFLOH88S2_XdlNqnMN4KtWuLjap4HbhKuDR-rFmXpPlyWcmbKzemHRLMRk3SbOJMgkSqFHkbuqZSJ',
    'client_secret': 'EK9jTN0tG_0zsfWZp25VRBc_apFe01DJXFN3wJ_4bhuN4QchhuV9Av1ruEVioWn8rQ2-cHCM-g7AGTzU'
  });





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
            const user= await db.get().collection(connection.USER_COLLECTION).
            findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        if(user.state)
                        {
                            console.log("login succed");
                            response.user=user
                            response.status=true
                            resolve(response)
                        }else{
                            console.log("blocked");
                            resolve(response)
                    }
                    }else{
                        console.log("login failes");
                        resolve({status:false})
                    }
                })
            }else{
                console.log("email incorect");
                // response.status=false
                // response.blockuser=true
                resolve({status:false})
            }
        })
    },
    doOtp:(userData)=>{
        let response={};
        return new Promise(async(resolve,reject)=>{
            let user= await db.get().collection(connection.USER_COLLECTION).findOne({mobile:userData.mobile})
            if(user){
                if(user.state){

                    response.status=true;
                    response.user=user;
                    client.verify.services(otp.serviceId).verifications.create({ to: `+91${userData.mobile}`, channel: "sms" }).then((verification)=>{})
                    //  console.log(response);
                     resolve(response)
                }else{
                    console.log("blocked user");
                    resolve(response)
                }
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
            let userCart=await db.get().collection(connection.CART_COLLECTION)
            .findOne({user:ObjectId(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=>product.item==proId)
                // console.log(proExist);
                if(proExist!=-1){
                    db.get().collection(connection.CART_COLLECTION)
                    .updateOne({user:ObjectId(userId),'products.item':ObjectId(proId)},{
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
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$product',0]}
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
    },
    changeProductQuantity:(details)=>{
        details.count = parseInt(details.count)
        details.quantity=parseFloat(details.quantity)
        // console.log(cartId.proId);
        return new Promise((resolve,reject)=>{
            if(details.count==-1 && details.quantity==1){
              db.get().collection(connection.CART_COLLECTION)
              .updateOne({_id:ObjectId(details.cart)},{
                $pull:{
                    products:{item:ObjectId(details.product)}
                }
              }).then((response)=>{
                resolve({removeProduct:true})
              })
            }else
            {
            db.get().collection(connection.CART_COLLECTION)
            .updateOne({_id:ObjectId(details.cart),'products.item':ObjectId(details.product)},
            {
                $inc:{'products.$.quantity':details.count}
            }).then((response)=>{
                resolve({status:true})
            })
        } 
        })
    },
    DeleteCartItem:(details)=>{
       return new Promise((resolve,reject)=>{
           db.get().collection(connection.CART_COLLECTION)
           .updateOne({_id:ObjectId(details.cart)},{
            $pull:{
                products:{item:ObjectId(details.product)}
            }
           }).then((response)=>{
            resolve(response)
           })
       })
    },
    //......................
    getTotalAmout:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let total=await db.get().collection(connection.CART_COLLECTION).aggregate([
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
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$product',0]}
                    }
                },
                 { $group:{_id:null,
                      total:{$sum:{ $multiply:['$quantity','$product.price']}}
                  }
                }
              
            ]).toArray()
            // console.log(total[0].total);
            resolve(total[0].total)
        })
    },
    //sub cartproducttotal
    getProductTotal:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let subproductTotal=await db.get().collection(connection.CART_COLLECTION).aggregate([
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
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$product',0]}
                    }
                },
                 { $project:{total:{ $multiply:['$quantity','$product.price']}
                  }
                }
              
            ]).toArray()
            if(subproductTotal.length!=0){
                resolve(subproductTotal)
            }else{
                resolve()
            }
        })
    },
    //ajax wrk to change product price in cart page
    getSubTotal:(details)=>{
        return new Promise(async(resolve,reject)=>{
          let subTotal=await db.get().collection(connection.CART_COLLECTION).aggregate([
            {
                $match:{user:ObjectId(details.user)}
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
                $match:{item:ObjectId(details.product)}
            },
            {
                $lookup:{
                    from:connection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
            },
            {
                $project:{
                    item:1,
                    quantity:1,
                    product:{$arrayElemAt:['$product',0]}
                }
            },
             { $project:{
                total:{ $multiply:['$quantity','$product.price']}
              }
            }  
            ]).toArray()
            
            if(subTotal.length!=0){
                console.log(subTotal[0].total);
               resolve(subTotal[0].total)
            }else{
                resolve()
            }
        })
    },
    // insert user address or add user address 
    addUserAddress:(userId,details)=>{
        return new Promise((resolve,reject)=>{
            let dt=new Date
            db.get().collection(connection.ADDRESS_COLLECTION).insertOne({
                user:ObjectId(userId),
                name:details.name,
                email:details.email,
                address:details.address,
                landmark:details.landmark,
                town:details.town,
                state:details.state,
                pincode:details.pincode,
                phone:details.phone,
                date:details.date=(dt.getDay()+"/"+dt.getMonth()+"/"+dt.getFullYear())
            }).then((data)=>{
                resolve(data)
            })
        })
    },
    //get all useradress
    getuserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            let address=db.get().collection(connection.ADDRESS_COLLECTION)
            .find({user:ObjectId(userId)}).toArray()
            resolve(address)
        })
    },
    //get edit user profile address
    editUserAddress:(Id,userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(connection.ADDRESS_COLLECTION)
            .findOne({$and:[{_id:ObjectId(Id)},{user:ObjectId(userId)}]}).then((editAddress)=>{
                resolve(editAddress)
            })
        })
    },
    updateUserAddress:(Id,userId,details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(connection.ADDRESS_COLLECTION)
            .updateOne({_id:ObjectId(Id),user:ObjectId(userId)},
            {
                $set:{
                    name:details.name,
                    email:details.email,
                    address:details.address,
                    landmark:details.landmark,
                    town:details.town,
                    state:details.state,
                    pincode:details.pincode,
                    phone:details.phone
                }
            }).then((data)=>{
                resolve(data)
            })
        })
    },
    //user delete profile address
    deleteProfileAddress:(Id,addressId)=>{
        console.log(Id);
        console.log(addressId);
        return new Promise(async(resolve,reject)=>{
            db.get().collection(connection.ADDRESS_COLLECTION)
            .deleteOne({_id:ObjectId(Id),user:ObjectId(addressId)}).then((data)=>{
                resolve(data)
            })
        })
    },
    //place order
    placeOrder:(order,proAdrress,products,Total)=>{
        console.log(proAdrress);
        // Total=parseInt(Total)
        return new Promise(async(resolve,reject)=>{
            //  console.log(order);

             let getAddress=await db.get().collection(connection.ADDRESS_COLLECTION).findOne({_id:ObjectId(proAdrress)})
            console.log(getAddress);
            
            if(getAddress){
                let dt=new Date
                let status=order['Payment']==='cod'?'placed':'pending'
                let orderObj={
                    delivaryDtails:{
                         name:getAddress.name,
                         address:getAddress.address,
                         landmark:getAddress.landmark
                    },
                    userId:ObjectId(order.userId),
                    paymentMethod:order['Payment'],
                    product:products,
                    date:(dt.getDay()+"/"+dt.getMonth()+"/"+dt.getFullYear()),
                    total:Total,
                    status:status
                }
                db.get().collection(connection.ORDER_COLLECTION).insertOne(orderObj).then((result)=>{
                 
                        // db.get().collection(connection.CART_COLLECTION).deleteOne({user:ObjectId(order.userId)})
 
                    // console.log(result.insertedId,"hai");
                    resolve(result.insertedId)
                })
            }

                

          
        })
    },
    getCartProductList:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let cart=await db.get().collection(connection.CART_COLLECTION)
        .findOne({user:ObjectId(userId)})
        resolve(cart.products)
        // console.log(cart.products);
      })
    },
    getUserOders:(userId)=>{
        // console.log(userId);
        return new Promise(async(resolve,reject)=>{
            let order=await db.get().collection(connection.ORDER_COLLECTION)
            .find({userId:ObjectId(userId)}).toArray()
            resolve(order)
            // console.log(order);
        })
    },
    getOrderDetails:(orderId)=>{
        // console.log(orderId+"hai");
        return new Promise(async(resolve,reject)=>{
            let orderItem=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
                {
                    $match:{_id:ObjectId(orderId),}
                },
                {
                    $unwind:'$product'
                },
                {
                  $project:{
                    item:'$product.item',
                    quantity:'$product.quantity'
                  }
                },
                {
                    $lookup:{
                        from:connection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$product',0]}
                    }
                }
            ]).toArray()
            // console.log(orderItem);
            resolve(orderItem)
        })
    },
    // generate razopay 
    generateRazorepy:(orderId,totalPrice)=>{
        return new Promise((resolve,reject)=>{
            var options = {
                amount: totalPrice * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt:"" +orderId
              };
              instance.orders.create(options, function(err, order) {
                if(err){
                    console.log(err);
                }else{
                    console.log("new order :",order);
                    resolve(order)
                }
            });
        })
    },

//verifaying to razorpay payment
    
  verifyPayment:(details)=>{
     return new Promise((resolve,reject)=>{
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256', 'ZrCRgxXVvyEVFG9zxAIMRoX6');
        hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id);
        hmac=hmac.digest('hex')
        // console.log(hmac,'SDJFKSLADJFKSADFKJSADFH');
        if(hmac==details.payment.razorpay_signature){
            resolve()
        }else{
            reject('didnt matching hmac == razorpay signature')
        }
    })
  },
  // change payment status
  ChangePaymentStatus:(orderId)=>{
     return new Promise((resolve,reject)=>{
        db.get().collection(connection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderId)},
        {
            $set:{
                status:'placed'
            }
        }).then((result)=>{
            resolve()
        })
     })
  },
  //
  generatePaypal:(orderId,totalPrice)=>{
    return new Promise((resolve,reject)=>{
            const create_payment_json = {
              "intent": "sale",
              "payer": {
                  "payment_method": "paypal"
              },
              "redirect_urls": {
                  "return_url": "http://localhost:3000/orderSuccess",
                  "cancel_url": "http://localhost:3000/cancel"
              },
              "transactions": [{
                  "item_list": {
                      "items": [{
                          "name": "Red Sox Hat",
                          "sku": "001",
                          "price": totalPrice,
                          "currency": "USD",
                          "quantity": 1
                      }]
                  },
                  "amount": {
                      "currency": "USD",
                      "total": totalPrice
                  },
                  "description": "Hat for the best team ever"
              }]
          };
          
          paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log('hai')
                throw error;
            } else {
                console.log(payment,'hai hello');
              resolve(payment)
                }
          });
          



    })
  }
     
}

