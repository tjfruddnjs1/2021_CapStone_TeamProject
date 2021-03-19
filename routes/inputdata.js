const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const router = express.Router();
const SggCode = require('../models/sggcode');
const SidoCode = require('../models/sidocode');
const Garden = require('../models/garden');

const apiRouter = require('./api');


// 유치원 데이터 삽입
const inputChildren = async () => {
  try{    
    let loValue,gardensInfo, info;       
    const sidoCodes = await SidoCode.findAll({});        
    let is_bus;
    var startTime = new Date().getTime();
    var startTime = new Date().getTime();
    for(let i = 0; i < sidoCodes.length; i++){
      // console.log('시도코드 : ' + sidoCodes[i].sidocode);
      let sggCodes = await SggCode.findAll({
        attributes : ['sggcode'],
        where : {
          sidocode : sidoCodes[i].sidocode,
        }
      });                  
      for(let j = 0; j < sggCodes.length; j++){        
        // console.log('시군구 코드 : ' + sggCodes[j].sggcode);
        let childrenInfo = [];
        gardensInfo = await apiRouter.requestApi(sidoCodes[i].sidocode, sggCodes[j].sggcode);                        
        info = gardensInfo.data.kinderInfo;                 
        for(let k = 0; k < info.length; k++){   
            // console.log(k);
            // console.log('주소 : ' + info[k].addr);
            loValue = await apiRouter.locationApi(info[k].addr);
            is_bus = await apiRouter.isBusChildrenApi(sidoCodes[i].sidocode, sggCodes[j].sggcode, info[k].kindercode);
            is_bus = (is_bus === 'Y') ? '운영' : '미운영';
            childrenInfo[k] = {
              gardencode : info[k].kindercode,
              category : info[k].establish,
              type : '유치원',
              name : info[k].kindername,
              phone : info[k].telno,
              address : info[k].addr,
              homepage : info[k].hpaddr,
              sggcode : sggCodes[j].sggcode,
              cctvnum : '',
              isbus : is_bus,
              latitude : loValue.x,
              longitude : loValue.y,
            }                               
        }                
        Garden.bulkCreate(childrenInfo);                
      }
    }    
    var endTime = new Date().getTime();           

    return 'Time is ' + ((endTime - startTime) * 1000 / 60);    
  }catch(err){
    console.error(err);    
  }
}

// 어린이집 데이터 삽입
const inputCarecenterData = async () => {
  try{    
    let gardensInfo, info;           
                  
    var startTime = new Date().getTime();
    var startTime = new Date().getTime();    

    const sggCodes = await SggCode.findAll({});  
    console.log(sggCodes.length);
    // for(let i =0; i< sggCodes.length; i++){
    //   if(sggCodes[i].sggcode == 47190){
    //     console.log(i);
    //     return 'success';
    //   }
    // }
    for(let i = 0; i < sggCodes.length; i++){            
        console.log(sggCodes[i].sggcode + ' : ' + sggCodes[i].sggname);
        let childrenInfo = [];

        
        info = await apiRouter.eachChildrenApi(sggCodes[i].sggcode.toString());         

        if(!info){
          continue;
        }        
        for(let j = 0; j < info.length; j++){               
          if(!info[j].la || !info[j].lo){
            info[j].la = 0;
            info[j].lo = 0;
          }
            childrenInfo[j] = {
              gardencode : info[j].stcode,
              category : info[j].crtypename,
              type : '어린이집',
              name : info[j].crname,
              phone : info[j].crtelno,
              address : info[j].craddr,
              homepage : info[j].crhome,
              sggcode : sggCodes[i].sggcode,
              cctvnum : info[j].cctvinstlcnt,
              isbus : info[j].crcargbname,
              latitude : info[j].lo,
              longitude : info[j].la,
            }                               
        }                          
        Garden.bulkCreate(childrenInfo);   
        setTimeout(() => {

        }, 1000);        
      }    
    var endTime = new Date().getTime();           
    return 'Time is ' + ((endTime - startTime) * 1000 / 60);    
  }catch(err){
    console.error(err);    
  }
}

router.get('/', async (req,res)=>{
  try{
    const result = await inputCarecenterData();
    res.send('success');
  }catch(err){
    console.error(err);
    next(err);
  }
  
});


module.exports = router;