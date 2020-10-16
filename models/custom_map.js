const mongoose=require('mongoose');
const path=require('path');
const multer=require('multer');
const PATH=path.join('/uploads/maps/');


const custom_mapSchema=new mongoose.Schema({
  name:{
      type:String,
  },
  path:{
      type:String
  },
  userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
custom_mapSchema.statics.upload=multer({storage:storage}).single('map');
custom_mapSchema.statics.Path=PATH;

const Custom_map=mongoose.model('Custom_map',custom_mapSchema);

module.exports=Custom_map;


