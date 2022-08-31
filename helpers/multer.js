const multer=require("multer")

const fileStorageEngin=multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,"./public/product-images")
      
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"--"+file.originalname);
    }
})

module.exports=multer({storage:fileStorageEngin})