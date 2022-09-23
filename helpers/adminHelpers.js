const db=require('../config/connection')
const connection=require('../config/collection')
var ObjectId = require('mongodb').ObjectId;

module.exports={
    getAllUsers:()=>{
       return new Promise(async(resolve,reject)=>{
        let users=await db.get().collection(connection.USER_COLLECTION).find().toArray()
        resolve(users)
       }) 
    },
    blockUser:(proId)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(connection.USER_COLLECTION).updateOne({_id:ObjectId(proId)},{$set:{state:false}}).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },
    unblockUser:(proId)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(connection.USER_COLLECTION).updateOne({_id:ObjectId(proId)},
            {$set:{state:true}}).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },
    addCatagory:(catagoryData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(connection.CATAGORY_COLLECTION).insertOne(catagoryData).then((data)=>{
                resolve(data)
            })
        })
    },
    getCatagory:()=>{
        return new Promise((resolve,reject)=>{
          let catagory=db.get().collection(connection.CATAGORY_COLLECTION).find().toArray()
          resolve(catagory)
        })
    },
    deleteCatagory:(catagoryId)=>{
         return new Promise((resolve,reject)=>{
            db.get().collection(connection.CATAGORY_COLLECTION).deleteOne({_id:ObjectId(catagoryId)}).then(()=>{
                resolve()
            })
         })
    },
    addProduct:(Product)=>{
        
        let response={}
        return new Promise(async(resolve,reject)=>{
            
             let prdct=await db.get().collection(connection.PRODUCT_COLLECTION).findOne({prd_Id:Product.prd_Id})
             console.log(prdct);
             if(prdct){
                response.status=true
                resolve(response)
             }
             else{
                let dt=new Date
                Product.date=(dt.getDay()+"/"+dt.getMonth()+"/"+dt.getFullYear())
                Product.price=parseInt(Product.price)
                db.get().collection(connection.PRODUCT_COLLECTION).insertOne(Product).then((result)=>{
                    resolve(result)
                   
                }) 
                resolve({status:false}) 
             }

          
        })
    },
    listProduct:()=>{
        return new Promise((resolve,reject)=>{
            let Product=db.get().collection(connection.PRODUCT_COLLECTION)
            .find().toArray()
            resolve(Product)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(connection.PRODUCT_COLLECTION)
            .deleteOne({_id:ObjectId(proId)}).then((data)=>{
                resolve(data)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise(async(resolve,reject)=>{
            let product=await db.get().collection(connection.PRODUCT_COLLECTION)
            .findOne({_id:ObjectId(proId)})
            resolve(product)
        })
    },
    updateProduct:(proId,proDetails)=>{
       
        return new Promise(async(resolve,reject)=>{
            proDetails.price=parseInt(proDetails.price)
            await db.get().collection(connection.PRODUCT_COLLECTION).updateOne({_id:ObjectId((proId))},
            {
                $set:{
            name:proDetails.name,
            prd_Id:proDetails.prd_Id,
            price:proDetails.price,
            catagory:proDetails.catagory,
            stock:proDetails.stock,
            offer:proDetails.offer,
            description:proDetails.description,
            image:proDetails.image

        }
        }).then((response)=>{
            resolve(response)
        })
   })
 },
 adminViewOrder:()=>{
    return new Promise(async(resolve,reject)=>{
        let orderDetails=await db.get().collection(connection.ORDER_COLLECTION).find().toArray()
        // console.log(orderDetails);
        resolve(orderDetails)
    })
 },
 adminViewSingleAddress:(singleId)=>{
    return new Promise(async(resolve,reject)=>{
        let singleAddress=await db.get().collection(connection.ORDER_COLLECTION)
        .findOne({_id:ObjectId(singleId)})
        // console.log(singleAddress);
        resolve(singleAddress)
    })
 },
 adminViewSigleOrder:(orderId)=>{
    // console.log(orderId+"hai");
    return new Promise(async(resolve,reject)=>{
        let singleOrderDetails=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
            {
                $match:{_id:ObjectId(orderId)}
            },
            {
                $unwind:'$product'
            },
            {
                $project:{
                    item:'$product.item',
                    quantity:'$product.quantity',
                    price:'$price'
                    
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
            
        ]).toArray()
        // console.log(singleOrderDetails);
        resolve(singleOrderDetails)
    })
 },
 adminSingleTotal:(orderId)=>{
    // console.log(orderId+"hai");
    return new Promise(async(resolve,reject)=>{
        let singleOrderTotal=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
            {
                $match:{_id:ObjectId(orderId)}
            },
            {
                $unwind:'$product'
            },
            {
                $project:{
                    item:'$product.item',
                    quantity:'$product.quantity',
                    price:'$price'
                    
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
                    _id:0,
                    item:1,
                    quantity:1,
                    total:{ $multiply:['$quantity',{$arrayElemAt:["$product.price",0]}]}
                }
            }
        ]).toArray()
        // console.log(singleOrderTotal);
        resolve(singleOrderTotal)
    })
 },
 //update order details in shipped
   shippedOrder:(shipId)=>{
    return new Promise(async(resolve,reject)=>{
        await db.get().collection(connection.ORDER_COLLECTION)
        .updateOne({_id:ObjectId(shipId)},
        {
            $set:{
                status:'Shipped'
            }
        }).then((data)=>{
            console.log(data);
            resolve(data)
        })
    })
  },
//  update order status in deliver
deliverdOrder:(delId)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(connection.ORDER_COLLECTION)
            .updateOne({_id:ObjectId(delId)},
            {
                $set:{
                    status:'Deliverd'
                }
            }).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },

    // update order status in cancled
    cancelOrder:(cancelId)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(connection.ORDER_COLLECTION)
            .updateOne({_id:ObjectId(cancelId)},
            {
                $set:{
                    status:'Cancled'
                }
            }).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },

    /* -------------------------------------------------------------------------- */
    /*                                Sales report                                */
    /* -------------------------------------------------------------------------- */


    // genarate to day by day sales report
    daySalesReport:(dt)=>{
        console.log(dt,"hia");
        return new Promise(async(resolve,reject)=>{
            let dayCollection=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
                {
                    $match:{
                        status:{$nin:['Cancled']}
                    }
                },
                {
                    $unwind:'$product'
                },
                {
                    $project:{
                        total:1,
                        date:1,
                        status:1,
                        paymentMethod:1,
                        _id:1,
                        item:'$product.item',
                        quantity:"$product.quantity"
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
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        total:1,
                        status:1,
                        item:1,
                        quantity:1,
                        _id:1,
                        paymentMethod:1,
                        product:{$arrayElemAt:['$product',0]}
                        
                    }
                },
                {
                  $match:{
                    date:dt
                  }
                },
                {
                    $group:{
                        _id:"$item",
                        quantity:{$sum:'$quantity'},
                        totalAmount:{$sum:{$multiply:['$quantity','$product.price']}},
                        name: { "$first": "$product.name" },
                        date: { "$first": "$date" },
                        price: { "$first": "$product.price" }
                    }
                }
            ]).toArray()
            // console.log(dayCollection);
            resolve(dayCollection)
        })
    },

    //count order
    countOrder:(dt)=>{
        return new Promise(async(resolve,reject)=>{
            let countOrder=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
                {
                    $match:{
                        status:{$nin:['Cancled']}
                    }
                },
                {
                    $project:{
                        _id:1,
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    }
                },
                {
                    $match:{
                        date:dt
                    }
                },
                {
                    $count:'date'
                }
            ]).toArray()
            resolve(countOrder)
        })
    },




    //gemerated by monthly sales Report
    monthlySalesReport:(dt)=>{
        console.log(dt);
        return new Promise(async(resolve,reject)=>{
            let monthSales=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
                {
                    $match:{
                        status:{$nin:['Cancled']}
                    }
                },
                {
                    $project:{
                        _id:1,
                        date: { $dateToString: { format: "%Y-%m", date: "$date" } },
                        newdate: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        total:1
                       
                    }
                },
                {
                    $match:{
                        date:dt
                    }
                },
                {
                  $group:{
                    _id:"$newdate",
                    count:{$sum:1},
                    total:{$sum:'$total'}
                  }
                }
                
            ]).toArray()
            // console.log(monthSales);
            resolve(monthSales)
        })
    },

// generate yearly report

yearlySales:(dt)=>{
    return new Promise(async(resolve,reject)=>{
        let yearOrder=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
            {
                $match:{
                    status:{$nin:['Cancled']}
                }
            },
            {
                $project:{
                    _id:1,
                    date: { $dateToString: { format: "%Y", date: "$date" } },
                    newdate: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    total:1
                }
            },
            {
                $match:{
                    date:dt
                }
            },
            {
                $group:{
                    _id:"$newdate",
                    count:{$sum:1},
                    total:{$sum:'$total'}
                }
            },
            // { $sort: { _id: 1 } }
           
        ]).toArray()
        // console.log(yearOrder,'haisdjhfjaskdhfjaskdfhsak');
        resolve(yearOrder)
    })
}

    
}