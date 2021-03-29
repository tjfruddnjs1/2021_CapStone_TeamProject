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
    let is_bus, cctvNum;
    var startTime = new Date().getTime();
    var startTime = new Date().getTime();
    for(let i = 15; i < sidoCodes.length; i++){      
      // console.log('시도코드 : ' + sidoCodes[i].sidocode);
      let sggCodes = await SggCode.findAll({
        attributes : ['sggcode'],
        where : {
          sidocode : sidoCodes[i].sidocode,
        }
      });                        
      for(let j = 0; j < sggCodes.length; j++){         
        console.log(sggCodes[j].sggcode);       
        console.log(sggCodes[j].sggname);       
        // console.log('시군구 코드 : ' + sggCodes[j].sggcode);
        let childrenInfo = [];
        gardensInfo = await apiRouter.requestApi(sidoCodes[i].sidocode, sggCodes[j].sggcode);                        
        info = gardensInfo.data.kinderInfo;                 
        for(let k = 0; k < info.length; k++){             
            // console.log(k);
            // console.log('주소 : ' + info[k].addr);
            loValue = await apiRouter.locationApi(info[k].addr);                     
            is_bus = await apiRouter.isBusChildrenApi(sidoCodes[i].sidocode, sggCodes[j].sggcode, info[k].kindercode);
            cctvNum = await apiRouter.cctvNumApi(sidoCodes[i].sidocode, sggCodes[j].sggcode, info[k].kindercode);
            is_bus = (is_bus === 'Y') ? '운영' : '미운영';            
            if(cctvNum == null){
              cctvNum = 0;
            }
            childrenInfo[k] = {
              gardencode : info[k].kindercode,
              gardencategory : info[k].establish,
              gardentype : '유치원',
              gardenname : info[k].kindername,
              gardentel : info[k].telno,
              address : info[k].addr,
              homepage : info[k].hpaddr,              
              cctvnum : cctvNum,
              isbus : is_bus,
              latitude : loValue.x,
              longitude : loValue.y,
              sggcode : sggCodes[j].sggcode,
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
        console.log(i);
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
              gardencategory : info[j].crtypename,
              gardentype : '어린이집',
              gardenname : info[j].crname,
              gardentel : info[j].crtelno,
              address : info[j].craddr,
              homepage : info[j].crhome,              
              cctvnum : info[j].cctvinstlcnt,
              isbus : info[j].crcargbname,
              latitude : info[j].lo,
              longitude : info[j].la,
              sggcode : sggCodes[i].sggcode,
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
const cctvNumApi = async (sidoCode, sggCode, kinderCode) => {  
  let result;
  const url = 'https://e-childschoolinfo.moe.go.kr/api/notice/safetyEdu.do';
  const key = process.env.KINDERGARDEN_KEY;  
  const requestUrl = url + '?key=' + key + '&sidoCode=' + sidoCode + '&sggCode='+sggCode;  
  result = await axios.get(requestUrl);     
  
  for(let i =0; i<result.data.kinderInfo.length; i++){    
    if(result.data.kinderInfo[i].kindercode == kinderCode){   
      console.log(result.data.kinderInfo[i].cctv_ist_total);
      return result.data.kinderInfo[i].cctv_ist_total;
    }
  }
  console.log('false');
  return '0';

}


router.get('/', async (req,res)=>{
  try{    
    // const result = await inputCarecenterData();    
    res.send('success');
  }catch(err){
    console.error(err);
    next(err);
  }
  
});


module.exports = router;