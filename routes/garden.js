const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const router = express.Router();

const apiRouter = require('./api');
const Garden = require('../models/garden');
const SggCode = require('../models/sggcode');
const SidoCode = require('../models/sidocode');
const User = require('../models/user');
const Review = require('../models/review');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const sequelize = require('sequelize');
const Op = sequelize.Op;

//session 유지를 위한 > passport module
router.use((req,res,next)=>{
  res.locals.user = req.user;
  next();
});

const paging = async (page, sggCode = null, type = null, name = null) => {        
  let block = 5;
  let list = 10;    
  let total;  
  if(type && name){
    total = await Garden.count(
      {
        where : {
          gardentype : type,
          gardenname : {[Op.like] : '%' + name + '%'},
        }
      }
    )  
    // if(total == 0)     {
    //   return false;
    // }
  }else if(sggCode)  {
    total = await Garden.count({where : {sggcode : {[Op.like] : sggCode + '%' }}});
  }else{
    total = await Garden.count();
  }    
    
    if(page <=1){
      page = 1;
    }   
  let pageNum = Math.ceil(total/list); // 총 페이지수
  console.log(pageNum);
  let blockNum = Math.ceil(pageNum/block); // 총 블록 수
  let nowBlock = Math.ceil(page/block);
  let gardens;  
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
  if(name && type){
    gardens = await Garden.findAndCountAll({
      offset : s_point,
      limit : 10,
      where : {
        gardentype : type,
        gardenname : {[Op.like] : '%' + name + '%'},
      }
     
    });         
  }else if(sggCode){
    gardens = await Garden.findAndCountAll({
      offset : s_point,
      limit : 10,
      where : {
        sggcode : {[Op.like] : sggCode + '%' },
      }
    });     
  }else{
    gardens = await Garden.findAndCountAll({
      offset : s_point,
      limit : 10,      
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

router.get('/sido', async(req, res) => {
  try{        
    const {code} = req.query;    
    if(code != ''){      
      const sggCode = await SggCode.findAll({
        include : [SidoCode],
        where : {
          sidocode : code
        }
      });      
      res.send({sggCode});
    }else{
      console.log('no data');
      res.send('데이터가 없습니다.');
    }            
  }catch(err){
    console.error(err);
  }
});

router.get('/', async (req,res)=>{
  try{            
    // sggcode = parseInt(sggcode);
    let result;
    const sidos = await SidoCode.findAll({});
    const {type, name, sgg, sido} = req.query;    
    
    let {page} = req.query;    

    if(!page){
      page = 1;
    }    
    if(page > 1){
      offset = 10 * (page - 1);
    }
    if(type && name){      
      console.log(name);
      result = await paging(page, null , type, name);      
      console.log(result);
      // if(result){
      //   res.render('garden/gardenlist', {total : result.gardens.count , info : result.gardens.rows, page : result, sidos : sidos});
      // }else{
      //   res.render('garden/gardenlist', {total : 0, sidos : sidos});
      // }   
      
    }else if(sido && !sgg){
      const sggCode = await SggCode.findAll({        
        include : [SidoCode],
        where : {
          sidocode : sido
        }
      });
      result = await paging(page, sido);  
      result.sidocode = sido;                 
      result.sggcode = sggCode;                  
    }else if(sgg){
      const sggCode = await SggCode.findAll({        
        include : [SidoCode],
        where : {
          sidocode : sido
        }
      });
        result = await paging(page,sgg);
        result.sidocode = sido;                 
        result.sggcode = sggCode;   
        result.code = sgg;        
    }else{                  
      result = await paging(page);   
    }     
    res.render('garden/gardenlist', {total : result.gardens.count , info : result.gardens.rows, page : result, sidos : sidos});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/:gardenCode', async(req, res) => {
  try{        
    const {gardenCode} = req.params;   
    
    const kinderInfo = await Garden.findOne({
        where : {
          gardencode : gardenCode,
        }
    });   

    const review = await Review.findAll({
      where : {
        gardencode : gardenCode,
      }
    });

    console.log(review);
          
    res.render('garden/gardenView', {info : kinderInfo, review : review});    
  }catch(err){
    console.error(err);
  }
});

router.get('/:gardenCode/review', isLoggedIn, async(req,res)=>{
  try{        
    const {gardenCode} = req.params; 
    
    const kinderInfo = await Garden.findOne({
        where : {
          gardencode : gardenCode,
        }
    });
          
    res.render('garden/review', {info : kinderInfo});    
  }catch(err){
    console.error(err);
  }
});

//리뷰 post 요청
router.post('/:gardenCode/review', isLoggedIn, async(req,res,next)=>{
  try{
      const { teacherName, attendTime, attendTimeDirect, reJoin, isCommunicate, isActive, isSafe, advantage, disAdvantage, lineReview } = req.body;
      const totalStar = (parseInt(reJoin) + parseInt(isCommunicate) + parseInt(isActive) + parseInt(isSafe))/4;
      const {gardenCode} = req.params;

      console.log(attendTime == "direct");

      if(attendTime != "dircet"){
          await Review.create({
              teacherName : teacherName,
              attendTime : attendTimeDirect,
              reJoin : parseInt(reJoin),
              isCommunicate : parseInt(isCommunicate),
              isActive : parseInt(isActive),
              isSafe : parseInt(isSafe),
              advantage : advantage,
              totalStar : totalStar,
              disAdvantage : disAdvantage,
              lineReview : lineReview,
              userNickname : req.user.nickname,
              gardencode : gardenCode,
          });
          res.send(
              "<script>alert('리뷰가 작성되었습니다.zz'); window.location='/garden';</script>"
          );
      }else{
          await Review.create({
              teacherName : teacherName,
              attendTime : attendTime,
              reJoin : parseInt(reJoin),
              isCommunicate : parseInt(isCommunicate),
              isActive : parseInt(isActive),
              isSafe : parseInt(isSafe),
              advantage : advantage,
              totalStar : totalStar,
              disAdvantage : disAdvantage,
              lineReview : lineReview,
              userNickname : req.user.nickname,
              gardencode : gardenCode
          });
          res.send(
              "<script>alert('리뷰가 작성되었습니다.'); window.location='/garden';</script>"
          );
      }   
  }catch(err){
      console.error(err);
      next(err);
  }
});

module.exports = router;