const express = require('express');
const router = express.Router();
const Garden = require('../models/garden');
const SggCode = require('../models/sggcode');
const SidoCode = require('../models/sidocode');

const sequelize = require('sequelize');
const Op = sequelize.Op;

//session 유지를 위한 > passport module
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

const findGardens = async (code = null) => {
  let gardens = {};  
  let childGardens;
  let dayCareGardens;  

  if(code){ //
    childGardens = await Garden.findAndCountAll({
      where : {    
        gardentype : '유치원',
        sggcode : {[Op.like] : code + '%' },
      }
    });    
    dayCareGardens = await Garden.findAndCountAll({
      where : {    
        gardentype : '어린이집',
        sggcode : {[Op.like] : code + '%' },
      }
    });    
  }else{ // 전체
    childGardens = await Garden.findAndCountAll({
      where : {    
        gardentype : '유치원',        
      }
    });    
    dayCareGardens = await Garden.findAndCountAll({
      where : {    
        gardentype : '어린이집',        
      }
    });    
  }
  gardens.childGardens = childGardens;
  gardens.dayCareGardens = dayCareGardens;

  return gardens;
}

const categoryCount = async (type, sggCode = null) => {
  let result = [];  
  
  const category = await Garden.findAll({
    attributes : [
      [sequelize.fn('DISTINCT', sequelize.col('gardencategory')), 'category'],      
    ],
    where : {
      gardentype : type
    }
  });
  
  if(sggCode){
    for(let i =0; i< category.length; i++){
      let kind = category[i].dataValues.category;
      result[i] = await Garden.count({
        where : {
          gardencategory : kind, 
          sggcode : {[Op.like] : sggCode + '%' },       
        }
      })                
    }      
  }else{
    for(let i =0; i< category.length; i++){
      let kind = category[i].dataValues.category;
      result[i] = await Garden.count({
        where : {
          gardencategory : kind,        
        }
      })                
    }      
  }
  

  return result;
}

//메인 페이지
router.get('/', async (req,res)=>{
  try{  
  const childCountResult = await categoryCount('유치원');  
  const dayCareCountResult = await categoryCount('어린이집');  
  const sidos = await allSido();    
  res.render('home/index', {sidos : sidos, childCount : childCountResult, dayCareCount : dayCareCountResult});
  }catch(err){
    console.error(err);
    next(err);
  }
});

// 시도 코드 용
router.post('/', async (req, res) => {
  try{
    const {sidoCode} = req.body;
    let sggs = {};        
    let gardens;
    let childCountResult;
    let dayCareCountResult;
    
    if(sidoCode){      
      sggs = await findAllSgg(sidoCode);  
      gardens = await findGardens(sidoCode);      
      childCountResult = await categoryCount('유치원', sidoCode);  
      dayCareCountResult = await categoryCount('어린이집', sidoCode);  
    }else{      
      sggs = 'no data';
      gardens = await findGardens();
      childCountResult = await categoryCount('유치원');  
      dayCareCountResult = await categoryCount('어린이집');  
    }    
    res.send({sggs : sggs, gardens : gardens, childCount : childCountResult, dayCareCount : dayCareCountResult});
  }catch(err){
    console.error(err);
    next(err);
  }
});

// 시군구용
router.get('/:sggCode', async (req, res) => {
  try{
    const {sggCode, sidoCode} = req.body;
    let childCountResult;
    let dayCareCountResult;
    let sggs = {};            
    let gardens;    
    if(sggCode){            
      gardens = await findGardens(sggCode);
      childCountResult = await categoryCount('유치원', sggCode);  
      dayCareCountResult = await categoryCount('어린이집', sggCode);  
    }else{      
      sggs = 'no data';
      gardens = await findGardens(sidoCode);
      childCountResult = await categoryCount('유치원', sidoCode);  
      dayCareCountResult = await categoryCount('어린이집', sidoCode);  
    }    
    res.send({gardens : gardens, childCount : childCountResult, dayCareCount : dayCareCountResult});
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;