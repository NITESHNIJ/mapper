const express=require('express');
var authenticate = require('../authenticate');
const mongoose = require('mongoose');
const custom_Map=require('../models/custom_map');
const router=express.Router();
const bodyParser = require('body-parser');
const user = require('../models/user');
router.use(bodyParser.json());

router.post('/',authenticate.verifyUser,(req,res)=>{
    
custom_Map.upload(req,res,async (err)=>{
    //console.log(req.name);
    if(err)
    {
        console.log('multer error');
        return res.json({error:`an error occured ${err}`});
    }
    let userid=req.user._id;
    let path=custom_Map.Path+req.file.filename;
    try{
    let mapexist=await custom_Map.findOne({name:req.body.name,userid});
    if(mapexist){
        console.log("map with name already exists");
        return res.json({"error":"Some error occured,Maybe a Map with same name already exists"});
    }
    await custom_Map.create({userid,name:req.body.name,path})
    }
    catch(err){
        return res.json({"error":`Some error occured,Maybe a Map with same name already exists ${err}`});
    }
    return res.status(200).json({"message":"map created succesfully"});
})
//return res.json('success');
});

router.get('/',authenticate.verifyUser, (req,res,next) => {
        var userid;
        if(req.user.usertype == 'admin')
            userid = req.user._id;
        else
            userid = req.user.parentid;
        
        custom_Map.find({
            userid: userid
        })
        .then((maps) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({data:maps});
        },
        (error) => {
            res.status(404).send(error);
        })
        .catch((error) => {
            res.status(404).send(error);
        });

    });



module.exports=router;