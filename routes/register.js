const express = require('express');
const router = express.Router();
const Garden = require('../models/garden');
const SggCode = require('../models/sggcode');
const SidoCode = require('../models/sidocode');
const User = require('../models/user');
const GardenRequest = require('../models/gardenRequest');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const sequelize = require('sequelize');
const Op = sequelize.Op;


router.use((req,res,next)=>{
  res.locals.user = req.user;  
  next();
});

const allSido = async () => {
  const sidoCode = await SidoCode.findAll({});  
  return sidoCode;  
}

const findAllSgg = async (sidoCode) => {
  const sggCode = await SggCode.findAll({
    where : {
      sidocode : sidoCode
    }
  });
  return sggCode;
}

const findGardens = async (page, type, sggCode, pathName = null, gardenName = null) => {
  let gardens = {};    
  let block = 5;
  let list = 5;    
  let total;  
  
if(pathName){
  total = await Garden.count({
    where : {    
      gardentype : type,        
      sggcode : {[Op.like] : sggCode + '%' },       
      address : {[Op.like] : '%' + pathName + '%'},
    }
  });        
}else{  
  total = await Garden.count({
    where : {    
      gardentype : type,        
      sggcode : {[Op.like] : sggCode + '%' },       
      gardenname : {[Op.like] : '%' + gardenName + '%'},
    }
  });        
}
  
  if(page <=1){
    page = 1;
  }   
  let pageNum = Math.ceil(total/list); // 총 페이지수
  console.log(pageNum);
  let blockNum = Math.ceil(pageNum/block); // 총 블록 수
  let nowBlock = Math.ceil(page/block);  
  if(nowBlock >= blockNum){
    nowBlock = blockNum;
  }else if(nowBlock <=0){
    nowBlock = 1;
  }

  let s_page = (nowBlock * block) - (block - 1);

  if(s_page <= 1){
    s_page = 1;
  }

  let e_page = nowBlock * block;

  if(pageNum <= e_page){    
    e_page = pageNum;
  }  
  let s_point = (page-1) * list;
  if(s_point <=0){
    s_point = 0;
  }else if(s_point > total){
    s_point = s_point - list*(page-2);
  }  
  if(pathName){
    gardens = await Garden.findAndCountAll({
      attributes : ['gardencode', 'address', 'gardenname'],
      offset : s_point,
      limit : 5,
      where : {    
        gardentype : type,        
        sggcode : {[Op.like] : sggCode + '%' },       
        address : {[Op.like] : '%' + pathName + '%'},
      }
     
    });     
  }else{
    gardens = await Garden.findAndCountAll({
      attributes : ['gardencode','address', 'gardenname'],
      offset : s_point,
      limit : 5,
      where : {    
        gardentype : type,        
        sggcode : {[Op.like] : sggCode + '%' },       
        gardenname : {[Op.like] : '%' + gardenName + '%'},
      }
     
    });    
  }
      
  
        result = { 
          "curPage": page,            
          "listPage": block, 
          "totalPage": pageNum, 
          "startPage": s_page, 
          "endPage": e_page,    
          "gardens" : gardens,                       
        } 
         
  return result;
}


//메인 페이지
router.get('/', async (req,res)=>{
  try{  
  
    res.render('register/');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/', async (req,res)=>{
  try{  
  
    res.render('register/');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/garden',  isLoggedIn, async (req,res)=>{
  try{  
  const user = req.user;
  if(!user.phone){
    res.send('<script>alert("본인인증이 필요합니다"); location.href = "/mypage/account";</script>')
  }
    
  res.render('register/gardenRegister', {phone : user.phone});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/garden',isLoggedIn,  async (req,res)=>{
  try{  
    const {type, gardencode, address, gardenname, writer, representative, phone, gardenphone, agree} = req.body;
    console.log(type, address, gardencode, gardenname, writer, representative, phone, gardenphone, agree);

    const gardenRequest = await GardenRequest.create({
      type,
      address,
      gardenname,
      writer,
      representative,
      phone,
      gardenphone,
      gardencode,
    })
  res.render('register/complete');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/parent', isLoggedIn, async (req,res)=>{
  try{  
    const user = req.user;
    if(!user.phone){
      res.send('<script>alert("본인인증이 필요합니다"); location.href = "/mypage/account";</script>')
    }
  res.render('register/parentRegister', {phone : user.phone});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/garden',isLoggedIn,  async (req,res)=>{
  try{  
      
  res.render('register/complete');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/agree',isLoggedIn, async (req,res)=>{
  try{    
    res.render('register/agree');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/address',isLoggedIn, async (req,res)=>{
  try{  
    const sidos = await allSido();
  res.render('register/address', {sidos : sidos});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/address',isLoggedIn, async (req, res) => {
  try{
    const {sidoCode} = req.body;    
    const sggs = await findAllSgg(sidoCode);
    res.send({sggs : sggs});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/address/gardens/:page?', isLoggedIn, async (req, res) => {
  try{
    const {type, sggCode, pathName, gardenName} = req.body;    
    let {page} = req.params;        
    if(!page){
      page = 1;
    }    
    if(page > 1){
      offset = 10 * (page - 1);
    }    
    console.log(gardenName);
    const gardens = await  findGardens(page, type, sggCode, pathName, gardenName);    
    res.send({result : gardens});
  }catch(err){
    console.error(err);    
  }
});



module.exports = router;