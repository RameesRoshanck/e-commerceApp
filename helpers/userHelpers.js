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


    /* -------------------------------------------------------------------------- */
    /*                                 1 dosignup                                 */
    /* -------------------------------------------------------------------------- */




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


/* --------------------------------- dologin -------------------------------- */


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


/* ---------------------------------- dootp --------------------------------- */

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


    /* ------------------------------- confirm otp ------------------------------ */


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


/* ------------------------------ view products ----------------------------- */


    viewProducts:()=>{
        return new Promise(async(resolve,reject)=>{
           let product=await db.get().collection(connection.PRODUCT_COLLECTION).aggregate([
             {
                $project:{
                    _id:1,
                    name:1,
                    prd_Id:1,
                    price:1,
                    catagory:1,
                    stock:1,
                    offer:1,
                    description:1,
                    image:1,
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    originelPrice:1,

                }
             }
           ]).toArray()
        //    console.log(product,"djhaskdjfhaskdf");
            resolve(product)
        })
    },


/* --------------------------- view sigle product --------------------------- */


    viewSigleProduct:(proId)=>{
        return new Promise(async(resolve,reject)=>{
          let product=await db.get().collection(connection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)})
          resolve(product) 
        })
    },



    /* -------------------------- //view brandwise view ------------------------- */

    brandView:(brandId)=>{
        return new Promise(async(resolve,reject)=>{
            let brand=await db.get().collection(connection.PRODUCT_COLLECTION).find({catagory:ObjectId(brandId)}).toArray()
        //    console.log(brand,'isthere femigation today');
        resolve(brand)
        })
    },


    /* -------------------------------------------------------------------------- */
    /*                                view brand                                */
    /* -------------------------------------------------------------------------- */

    
    viewbrand:()=>{
          return new Promise(async(resolve,reject)=>{
            let brand=await db.get().collection(connection.CATAGORY_COLLECTION).find().toArray()
            // console.log(brand);
            resolve(brand)
          })
    },






    /* ----------------------------- vew Banner imag ---------------------------- */


    viewBanner:()=>{
        return new Promise(async(resolve,reject)=>{
            let banner=await db.get().collection(connection.BANNER_COLLECTION).find().toArray()
            // console.log(banner);
            resolve(banner[0])
        })
    },




    /* ------------------------------- add to cart ------------------------------ */


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



    /* ----------------------------- get add product ---------------------------- */


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


    /* ----------------------------- get cart count ----------------------------- */


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


/* ----------------------- change cart items quantity ----------------------- */


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


/* ---------------------------- delete cart items --------------------------- */


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
     

    /* -------------------------- total amount of cart -------------------------- */


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
                    total:{$sum:{  $multiply: [
                    //   "$product.price", "$quantity"
                      {  $toInt: "$quantity"},
                      {  $toInt: "$product.price" }
                  ]}}
                }
              }
              
            ]).toArray()
            // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&',total);
            // console.log(total[0].total);
            if(total[0].length !==0){
                resolve(total[0].total)
            }else{
                resolve()  
            }

        })
    },


    /* -------------------------- sub cartproducttotal -------------------------- */


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
                { $project:{
                    total:{ $multiply:[
                                    {  $toInt: "$quantity"},
                                    {  $toInt: "$product.price"}
                    ]}
                  }
                } 
              
    ]).toArray()
            if(subproductTotal.length!==0){
                resolve(subproductTotal)
            }else{
                resolve()
            }
        })
    },


    /* ------------- //ajax wrk to change product price in cart page ------------ */


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
                total:{ $multiply:[
                                {  $toInt: "$quantity"},
                                {  $toInt: "$product.price"}
                ]}
              }
            }  
            ]).toArray()
            if(subTotal.length!==0){
               resolve(subTotal[0].total)
            }else{
                resolve()
            }
         })
    },


    /* --------------- // insert user address or add user address --------------- */



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


    /* -------------------------- // get all useradress ------------------------- */


    getuserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            let address=db.get().collection(connection.ADDRESS_COLLECTION)
            .find({user:ObjectId(userId)}).toArray()
            resolve(address)
        })
    },



    /* --------------------- //get edit user profile address -------------------- */


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


    /* ---------------------- //user delete profile address --------------------- */


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

    /* -------------------------------------------------------------------------- */
    /*        checkout page  and insert or create order collection and Cod        */
    /* -------------------------------------------------------------------------- */

    placeOrder:(order,proAdrress,products,Total)=>{
        console.log(proAdrress,'proaddress');
        console.log(products,'products');
        console.log(order,'order');

        // Total=parseInt(Total)
        return new Promise(async(resolve,reject)=>{
            //  console.log(order);

             let getAddress=await db.get().collection(connection.ADDRESS_COLLECTION).findOne({_id:ObjectId(proAdrress)})
            console.log(getAddress);
            
            if(getAddress){
               
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
                    date:new Date(),
                    total:Total,
                    status:status
                }
                db.get().collection(connection.ORDER_COLLECTION).insertOne(orderObj).then((result)=>{
                 
                        db.get().collection(connection.CART_COLLECTION).deleteOne({user:ObjectId(order.userId)})
                        
                        products.forEach(element => {
                            element.quantity=parseInt(element.quantity)
                            console.log(element.quantity,'+++++++++');
                            db.get().collection(connection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(element.item)},
                            {
                                $inc:{stock:-(element.quantity)}
                                
                            })
                        });
                        
 
                    // console.log(result.insertedId,"hai");
                    resolve(result.insertedId)
                })
            }

                

          
        })
    },

   /* -------------------------------------------------------------------------- */
   /*                create the order collection in online payment               */
   /* -------------------------------------------------------------------------- */

   onlinePayment:(order,proAdrress,products,Total)=>{
    console.log(proAdrress);
    // Total=parseInt(Total)
    return new Promise(async(resolve,reject)=>{
        //  console.log(order);

         let getAddress=await db.get().collection(connection.ADDRESS_COLLECTION).findOne({_id:ObjectId(proAdrress)})
        console.log(getAddress);
        
        if(getAddress){
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
                date:new Date(),
                total:Total,
                status:status
            }
            db.get().collection(connection.ORDER_COLLECTION).insertOne(orderObj).then((result)=>{
             
                products.forEach(element => {
                    db.get().collection(connection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(element.item)},
                    {
                        $inc:{stock:-(element.quantity)}
                    })
                });

               // console.log(result.insertedId,"hai");
                resolve(result.insertedId)
            })
        }
})
},


    /* -------------------------------------------------------------------------- */
    /*                           get cart products only                           */
    /* -------------------------------------------------------------------------- */
    getCartProductList:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let cart=await db.get().collection(connection.CART_COLLECTION)
        .findOne({user:ObjectId(userId)})
        resolve(cart.products)
        // console.log(cart.products);
      })
    },

    /* -------------------------------------------------------------------------- */
    /*                        get order in order collection                       */
    /* -------------------------------------------------------------------------- */


    getUserOders:(userId)=>{
        // console.log(userId);
        return new Promise(async(resolve,reject)=>{
            let order=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
                {
                    $match:{
                        userId:ObjectId(userId)
                    }
                },
                {
                    $project:{
                        _id:1,
                        delivaryDtails:1,
                        userId:1,
                        paymentMethod:1,
                        total:1,
                        status:1,
                        date:{ $dateToString: { format: "%Y-%m-%d", date: "$date" } }

                    }
                    
                }
            ]).toArray()
            resolve(order)
            //  console.log(order,'hai order');
        })
    },

    /* -------------------------------------------------------------------------- */
    /*    gnarate user order details and to get in products                       */
    /* -------------------------------------------------------------------------- */

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


 /* -------------------------------------------------------------------------- */
 /*                              generate razopay                              */
 /* -------------------------------------------------------------------------- */


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


/* -------------------------------------------------------------------------- */
/*                       verifaying to razorpay payment                       */
/* -------------------------------------------------------------------------- */
 

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


  /* -------------------------------------------------------------------------- */
  /*                    change payment status online payment status             */
  /* -------------------------------------------------------------------------- */
  

  ChangePaymentStatus:(orderId,userId)=>{
     return new Promise((resolve,reject)=>{
        db.get().collection(connection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderId)},
        {
            $set:{
                status:'placed'
            }
        }).then((result)=>{
            db.get().collection(connection.CART_COLLECTION).deleteOne({user:ObjectId(userId)})
            resolve()
        })
     })
  },


  /* -------------------------------------------------------------------------- */
  /*                              genarate pay pal                              */
  /* -------------------------------------------------------------------------- */


  generatePaypal:(orderId,totalPrice)=>{
    return new Promise((resolve,reject)=>{
            const create_payment_json = {
              "intent": "sale",
              "payer": {
                  "payment_method": "paypal"
              },
              "redirect_urls": {
                  "return_url": `http://localhost:3000/paypalsuccess/${orderId}`,
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
    },



    /* -------------------------------------------------------------------------- */
    /*                               add to wishlist                              */
    /* -------------------------------------------------------------------------- */


    
    addToWishlist:(proId,userId)=>{
        let proObj={
              item:ObjectId(proId),
              state:true
          }
        return new Promise(async(resolve,reject)=>{
            let response={};
            let wishlist=await db.get().collection(connection.WISHLIST_COLLECTION).findOne({user:ObjectId(userId)})
           if(wishlist){
            let proExist= await wishlist.products.findIndex(product=>product.item==proId)
            // console.log(proExist,'hai every one');
            if(proExist!=-1 ){
                db.get().collection(connection.WISHLIST_COLLECTION).updateOne({user:ObjectId(userId)},
                {
                  $pull:{ products:proObj }
                }).then(()=>{
                    response.status=false
                    resolve(response)
                })
            }else{
              db.get().collection(connection.WISHLIST_COLLECTION).updateOne({user:ObjectId(userId)},
              {
                $push:{ products:proObj }
              }
              ).then((response)=>{
                response.status=true
                resolve(response)
              })
            }
           }else{
            let wishlistObj={
                user:ObjectId(userId),
                products:[proObj]
            }
            db.get().collection(connection.WISHLIST_COLLECTION).insertOne(wishlistObj).then((result)=>{
                response.status=true
                resolve(response)
            })
           }
        })
    },


    /* ------------------------- //get wishlist Product ------------------------- */


    getWishlist:(userId)=>{
          return new Promise(async(resolve,reject)=>{
            let wishlist= await db.get().collection(connection.WISHLIST_COLLECTION).aggregate([
                {
                    $match:{
                        user:ObjectId(userId)
                    }
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        state:'$Products.state'
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
                    $project: {
                        product: { $arrayElemAt: ['$product', 0] }

                    }
                }

            ]).toArray()
            // console.log(wishlist[0].product,'hello man');
            resolve(wishlist);
          })
    },


    /* --------------------------- // whishlist count --------------------------- */

    getWishlistCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0;
            let wishlist=await db.get().collection(connection.WISHLIST_COLLECTION).findOne({user:ObjectId(userId)})
            
            if(wishlist){
                count=wishlist.products.length
            }
            // console.log(count,'wishlist count');
            resolve(count)
        })
    },


    /* ---------------------------- //delete wishlist --------------------------- */


    DeleteWishlist:(Details)=>{
        console.log(Details,'hello');
        return new Promise((resolve, reject) => {
            db.get().collection(connection.WISHLIST_COLLECTION).updateOne({ _id: ObjectId(Details.wishlist) },
                {
                    $pull: { products:{item:ObjectId(Details.product)}}
                    
                }).then((response) => {
                    // console.log(response)
                    resolve(response)
                })
        })   
    },



    /* -------------------------------------------------------------------------- */
    /*                                coupon offer                                */
    /* -------------------------------------------------------------------------- */


    applayCoupon:(Details,userId,date,amount)=>{

        // console.log(userId,'userid');
        return new Promise(async(resolve,reject)=>{
            let response={}

            let validCoupon=await db.get().collection(connection.COUPON_COLLECTION).findOne({code:Details.coupon})
                
            if(validCoupon)
            {
                // console.log(validCoupon,'vallidCoupon');
              const expdate= new Date(validCoupon.expiryDate)
                //    console.log(expdate,'=====');
                //    console.log(date,'=======');
              response.Data=validCoupon

               //   let user= await db.get().collection(connection.COUPON_COLLECTION).findOne({code:Details.coupon , user})
                //   console.log(user,'hai');


                if(expdate >= date)
                {
                    // console.log('date valid');
                    response.dateValid=true
                    resolve(response)

                    if(amount>=validCoupon.minAmount){

                        response.verifyMinAmount=true
                        resolve(response)

                            if(amount<=validCoupon.maxAmount)
                            {
                        
                                response.verifyMaxAmount=true
                                resolve(response)
                               }else{

                                response.invalidMaxAmount=true
                                response.maxAmountMsg='your maximum purchase should be'+validCoupon.maxAmount
                                resolve(response)
                            }
                    }else{
                        response.invaidMinAmount=true
                        response.minAmoutMsg='your minimum purchase should be'+validCoupon.minAmount
                        resolve(response)
                    }
                }else{
                response.dateInvalid=true
                response.dateInvalidMessage="Date is expired"
                }
            }else{
                response.invalidCoupon=true
                response.invalidMessage="This coupon is ivalid"
                resolve(response)
            }

            if(response.dateValid && response.verifyMinAmount && response.verifyMaxAmount){
                    response.varifying=true
                    resolve(response)
            }

            })
        },


        /* ------------------------- coupon in checkout page ------------------------ */
        
    
        CheckoutCoupon:(couponCode)=>{
            console.log(couponCode,'coupon code');
            return new Promise(async(resolve,reject)=>{

                let coupon= await db.get().collection(connection.COUPON_COLLECTION).findOne({code:couponCode})

                resolve(coupon)
            })
        }

     
}



