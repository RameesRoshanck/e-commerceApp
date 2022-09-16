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
 }
}