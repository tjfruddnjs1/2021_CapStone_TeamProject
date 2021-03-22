const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const router = express.Router();

const apiRouter = require('./api');
const Garden = require('../models/garden');
const SggCode = require('../models/sggcode');
const SidoCode = require('../models/sidocode');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const paging = async (page, paramName = null, param = null, name = null) => {        
  let block = 5;
  let list = 10;
    
  let total;  
  // if(paramName == `type`){
  //   total = await Garden.count({where : {type : param, name : {[Op.like] : '%' + name + '%'}}});
  // }else if(paramName == `sggcode`){
    
  // }else{
  //   total = await Garden.count();    
  // }
    if(param){
      total = await Garden.count({where : {[paramName] : param}});
    }else{
      total = await Garden.count();
    }
    if(page <=1){
      page = 1;
    }   
  let pageNum = Math.ceil(total/list); // 총 페이지수
  let blockNum = Math.ceil(pageNum/block); // 총 블록 수
  let nowBlock = Math.ceil(page/block);
  let gardens;
  console.log('blockNum : ' + blockNum);
console.log('nowBlock : ' + nowBlock);
  if(nowBlock >= blockNum){
    nowBlock = blockNum;
  }else if(nowBlock <=0){
    nowBlock = 1;
  }

  let s_page = (nowBlock * block) - (block - 1);
  console.log(s_page);
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
  if(param){
    gardens = await Garden.findAndCountAll({
      offset : s_point,
      limit : 10,
      where : {
        [paramName] : param,
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
        where : {
          sidocode : code
        }
      });      
      res.send(sggCode);
    }else{
      console.log('no data');
      res.send('데이터가 없습니다.');
    }            
  }catch(err){
    console.error(err);
  }
});

router.get('/:sggcode?', async (req,res)=>{
  try{        
    let {sidoCode, sggcode} = req.params;
    sggcode = parseInt(sggcode);
    let result;
    const sidos = await SidoCode.findAll({});
    const {type, name} = req.query;    

    
    let {page} = req.query;    

    if(!page){
      page = 1;
    }

    if(type && name){
      result = await paging(page, `type`, type, name);
    }
    // if(page > 1){
    //   offset = 10 * (page - 1);
    // }
            
    if(sggcode){                                       
        result = await paging(page,`sggcode`, sggcode);                
        // res.render('garden/gardenlist', {total : result.gardens.count , info : result.gardens.rows, page : result, sidos : sidos});
    }else{   
        console.log('here');                  
        result = await paging(page);                                                                   
        
    }                
    res.render('garden/gardenlist', {total : result.gardens.count , info : result.gardens.rows, page : result, sidos : sidos});
  }catch(err){
    console.error(err);
    next(err);
  }
});





router.post('/search', async(req, res) => {
  
})



module.exports = router;