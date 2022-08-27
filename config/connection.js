require('dotenv').config()
const mongoClient=require('mongodb').MongoClient

const URL=process.env.URL

const state={
    db:null
}

module.exports.connect=function(done){
    const url=URL
    const dbname='lapmart'
    
    mongoClient.connect(url,(err,data)=>{
     if(err) done(err)
      state.db=data.db(dbname)
      done()
    })
}

module.exports.get=function(){
    return state.db;
}