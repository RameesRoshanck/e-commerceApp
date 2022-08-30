const db=require('../config/connection')
const connection=require('../config/collection')
const objectId = require('mongodb').ObjectId

module.exports={
    getAllUsers:()=>{
       return new Promise(async(resolve,reject)=>{
        let users=await db.get().collection(connection.USER_COLLECTION).find().toArray()
        resolve(users)
       }) 
    },
    blockUser:(proId)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(connection.USER_COLLECTION).updateOne({_id:objectId(proId)},{$set:{state:false}}).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },
    unblockUser:(proId)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(connection.USER_COLLECTION).updateOne({_id:objectId(proId)},
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
            db.get().collection(connection.CATAGORY_COLLECTION).deleteOne({_id:objectId(catagoryId)}).then((data)=>{
                resolve(data)
            })
         })
    }
}