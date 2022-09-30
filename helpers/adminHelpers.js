const db=require('../config/connection')
const connection=require('../config/collection')
var ObjectId = require('mongodb').ObjectId;
const fs=require('fs');
const { resolve } = require('path');




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


    
     /* -------------------------------------------------------------------------- */
     /*                             to start with brand                            */
     /* -------------------------------------------------------------------------- */



    addCatagory:(BrandData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(connection.CATAGORY_COLLECTION).insertOne(BrandData).then((data)=>{
                resolve(data)
            })
        })
    },


    /* -------------------------------- get all Brands ------------------------------- */


    getCatagory:()=>{
        return new Promise(async(resolve,reject)=>{
          let Brand=await db.get().collection(connection.CATAGORY_COLLECTION).find().toArray()
          resolve(Brand )
        })
    },

   
    /* ------------------------ get single Brand details ------------------------ */


    editCatagory:(BrandId)=>{
        return new Promise(async(resolve,reject)=>{
            let Brand=await db.get().collection(connection.CATAGORY_COLLECTION).findOne({_id:ObjectId(BrandId)})
            console.log(Brand);
            resolve(Brand)
        })
    },
    

    /* ------------------------------ update Brand ------------------------------ */
   



    updateBrand:(BrandId,BrandDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let img = await db.get().collection(connection.CATAGORY_COLLECTION).findOne({ _id: ObjectId(BrandId) })
            if (BrandDetails.image.length == 0) {
                BrandDetails.image = img.image
            }
            let data=await db.get().collection(connection.CATAGORY_COLLECTION)
             .updateOne({_id:ObjectId(BrandId)},
             {
                $set:{
                    catagory:BrandDetails.catagory,
                    image:BrandDetails.image
                }
             }).then((data)=>{
                resolve(data)
             })
        })
    },



    deleteCatagory:(catagoryId)=>{
         return new Promise((resolve,reject)=>{
            db.get().collection(connection.CATAGORY_COLLECTION).deleteOne({_id:ObjectId(catagoryId)}).then((data)=>{
                resolve(data)
            })
         })
    },

    /* -------------------------------------------------------------------------- */
    /*                          to start Product section                          */
    /* -------------------------------------------------------------------------- */



    
    addProduct:(Product)=>{
        
        let response={}
        return new Promise(async(resolve,reject)=>{
             let prdct=await db.get().collection(connection.PRODUCT_COLLECTION).findOne({prd_Id:Product.prd_Id})
            //  console.log(prdct);
             if(prdct){
                response.status=true
                resolve(response)
             }
             else{
                Product.catagory=ObjectId(Product.catagory)
                Product.date=new Date;
                // Product.price=parseInt(Product.price)
                // Product.offer=parseInt(Product.offer)
                
                if(Product.offer){
                    newprice = Math.round((Product.price) * ((100 - Product.offer) / 100))

                    Product.originelPrice=Product.price
                    Product.price= "" +newprice
                
                db.get().collection(connection.PRODUCT_COLLECTION).insertOne(Product).then((result)=>{
                    resolve(result)
                   
                }) 
                resolve({status:false}) 
             }else{
                db.get().collection(connection.PRODUCT_COLLECTION).insertOne(Product).then((result)=>{
                    resolve(result)
                   
                }) 
                resolve({status:false}) 

             }
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
            db.get().collection(connection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)}).then((result)=>{
                for (let index = 0; index < result.image.length; index++) {
                    const element = result.image[index];
                   fs.unlink("public" + "/product-images/" + element,(err)=>{
                    if(err){
                        console.log(err);
                        }else{
                            console.log('delete success');
                        }
                    })
                }
            })

            db.get().collection(connection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(proId)}).then((data)=>{
       
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
            // proDetails.price=parseInt(proDetails.price)
            proDetails.catagory=ObjectId(proDetails.catagory)
            // proDetails.offer=parseInt(proDetails.offer)
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


 /* -------------------------------------------------------------------------- */
 /*                          to generate banner images                         */
 /* -------------------------------------------------------------------------- */



 /* --------------------------- //add banner images -------------------------- */


  addBanner:(Banner)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(connection.BANNER_COLLECTION).insertOne(Banner).then((data)=>{
            resolve(data)
        })
      })
   },


   /* ----------------------------- // view banners ---------------------------- */


   listBanner:()=>{
    return new Promise(async(resolve, reject) => {
        let Banner=await db.get().collection(connection.BANNER_COLLECTION).find().toArray()
        // console.log(Banner,'hai view Banner');
        resolve(Banner)
    })
   },


   /* --------------------- // view a single banner details -------------------- */


   editBanner:(BannerId)=>{
    return new Promise(async(resolve,reject)=>{
        let Banner=await db.get().collection(connection.BANNER_COLLECTION).findOne({_id:ObjectId(BannerId)})
        resolve(Banner)
    })
   },
   

   /* ---------------------------- // updatae banner --------------------------- */


   updateBanner:(bannerId,Details)=>{
    return new Promise(async(resolve,reject)=>{
         
        let img = await db.get().collection(connection.BANNER_COLLECTION).findOne({ _id: ObjectId(bannerId) })
        if (Details.image.length == 0) {
            Details.image = img.image
        }
       let Banner=await db.get().collection(connection.BANNER_COLLECTION)
       .updateOne({_id:ObjectId(bannerId)},
       {
        $set:{
            name:Details.name,
            image:Details.image
        }
       }).then((response)=>{
        resolve(response)
       })
    })
   },
     

    /* ---------------------------- // delete Banner ---------------------------- */
 
    deleteBanner:(BannerId)=>{
        console.log(BannerId,"kiti macha");
        return new Promise(async(resolve,reject)=>{
            let banner=await db.get().collection(connection.BANNER_COLLECTION)
            .deleteOne({_id:ObjectId(BannerId)})
            console.log(banner,'hai every one');
            resolve(banner)
        })
    },








/* -------------------------------------------------------------------------- */
/*                               get orders list                              */
/* -------------------------------------------------------------------------- */

 adminViewOrder:()=>{
    return new Promise(async(resolve,reject)=>{
        let orderDetails=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
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
        // console.log(orderDetails,"order details");
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
                    item:1,
                    quantity:1,
                    product:{$arrayElemAt:['$product',0]}
                }
            },
            {
                $project:{
                    _id:0,
                    item:1,
                    quantity:1,
                    total:{ $multiply:[{$toInt:"$quantity"},{$toInt:"$product.price"}]}
                }
            }
        ]).toArray()
        // console.log(singleOrderTotal);
        resolve(singleOrderTotal)
    })
 },


 /* -------------------- //update order details in shipped ------------------- */


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

/* ------------------- //  update order status in deliver ------------------- */


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


    /* -------------------- // update order status in cancled ------------------- */


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


    /* ----------------- // genarate to day by day sales report ----------------- */


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

    /* ------------------------------ //count order ----------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                                monthlySalesReport                          */
  /* -------------------------------------------------------------------------- */


    /* ------------------- //gemerated by monthly sales Report ------------------ */


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

    
    
    /* ------------------ //cout total order count in maonthly ------------------ */


    countOrdermonthly:(dt)=>{
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
                        date: { $dateToString: { format: "%Y-%m", date: "$date" } },
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


 /* -------------------------------------------------------------------------- */
 /*                           sales report in yearlly                          */
 /* -------------------------------------------------------------------------- */



/* ------------------------ // generate yearly report ----------------------- */


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
},


/* ------------------------ // total count in yearlly ----------------------- */


countOrderYearlly:(dt)=>{
    return new Promise(async(resolve,reject)=>{
        let count=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
            {
                $match:{
                    status:{$nin:['Cancled']}
                }
            },
            {
                $project:{
                    _id:1,
                    date: { $dateToString: { format: "%Y", date: "$date" } },
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
        // console.log(count,"do you kanow how much i suffing here")
        resolve(count)
    })
},

    /* -------------------------------------------------------------------------- */
    /*                        end the sales report section                        */
    /* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
/*                               start to graph                               */
/* -------------------------------------------------------------------------- */


/* ------------------------------ payment graph ----------------------------- */


paymentGraph:()=>{
    return new Promise(async(resolve,reject)=>{
        let paymentGrph=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
          {
            $project:{
                date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                total:1,
                paymentMethod:1
            }
          },
          {
            $group:{
                _id:'$paymentMethod',
                TotalAmount:{$sum:'$total'}
            }
          }
        ]).toArray()
        // console.log(paymentGrph,"hello");
        resolve(paymentGrph)
    })
},


/* ------------------------------- sales graph ------------------------------ */


salesGrph:()=>{
    return new Promise(async(resolve,reject)=>{
        let sales=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
            {
               $project:{
                date:1,
                total:1
               } 
            },
            {
                $group:{
                    _id:{$dateToString: { format: "%Y-%m-%d", date: "$date" }},
                    TotalAmount:{$sum:'$total'},
                    count:{$sum:1}
                }
            },
            {
                 $sort : { _id: 1 }
            }

        ]).toArray()
        resolve(sales)
        // console.log(sales,"hai sales report");
    })
},

    /* --------------------------- monthly sales graph -------------------------- */


    monthlygrph:()=>{
        return new Promise(async(resolve,reject)=>{
            let monthly=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
                {
                   $project:{
                    date:1,
                    total:1
                   }
                },
                {
                    $group:{
                        _id:{$dateToString: { format: "%Y-%m", date: "$date" }},
                        TotalAmount:{$sum:'$total'},
                        count:{$sum:1}
                    }
                }
            ]).toArray()
            // console.log(monthly);
            resolve(monthly)
        })
    },


    /* --------------------------- yearly sales graph --------------------------- */


    yearlygrph:()=>{
        return new Promise(async(resolve,reject)=>{
            let yearly=await db.get().collection(connection.ORDER_COLLECTION).aggregate([
                {
                    $project:{
                        date:1,
                        total:1
                    }
                },
                {
                    $group:{
                        _id:{$dateToString: { format: "%Y", date: "$date" }},
                        TotalAmount:{$sum:'$total'},
                        count:{$sum:1}
                    }
                }
            ]).toArray()
            // console.log(yearly)
            resolve(yearly)
        })
    },



    /* -------------------------------------------------------------------------- */
    /*                                 brand offer                                */
    /* -------------------------------------------------------------------------- */


    addBrandOffer:(brandId)=>{
        // console.log(brandId,"details");
        return new Promise(async(resolve,reject)=>{
          let brand=await db.get().collection(connection.PRODUCT_COLLECTION).aggregate([
            {
                $match:{
                    catagory:ObjectId(brandId)
                }
            }
          ]).toArray()
             resolve(brand) 

            })
    },

   
    updateBrandOffer:(proId,offprice,offer)=>{
    return new Promise(async(resolve,reject)=>{
        let brdOffer= await db.get().collection(connection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)})
         let price=0

        if(brdOffer.originelPrice){
          price=brdOffer.originelPrice
        }else{
            price=brdOffer.price
        }
        let updateProduct= await db.get().collection(connection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(proId)},
        {
          $set:{
            originelPrice:price,
            price:""+ offprice,
            offer:""+offer
        }
        })
        // console.log(updateProduct,'GJHGJHFHGFHGFHGFH');
        resolve(updateProduct)
    })
    }


    
}