const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

const router = express.Router();
var parser = require('xml2json-light');
dotenv.config();


// 유치원 api
const requestApi = async (sidoCode = '11', sggCode= '11680', currentPage = '1') => {    
    let result;
    const url = 'https://e-childschoolinfo.moe.go.kr/api/notice/basicInfo.do';
    const key = process.env.KINDERGARDEN_KEY;
        
    const requestUrl = url + '?key=' + key + '&sidoCode=' + sidoCode + '&sggCode='+sggCode;    
    result = await axios.get(requestUrl);                
    return result;

}


// 유치원 차량운행여부 api
const isBusChildrenApi = async (sidoCode, sggCode, kindercode) => {  
  let result;
  const url = '	https://e-childschoolinfo.moe.go.kr/api/notice/schoolBus.do';
  const key = process.env.KINDERGARDEN_KEY;  
  const requestUrl = url + '?key=' + key + '&sidoCode=' + sidoCode + '&sggCode='+sggCode;  
  result = await axios.get(requestUrl);     
  
  for(let i =0; i<result.data.kinderInfo.length; i++){    
    if(result.data.kinderInfo[i].kindercode == kindercode){            
      return result.data.kinderInfo[i].vhcl_oprn_yn;
    }
  }

  return 'There is no garden';

}

// 유치원 cctv api
const cctvNumApi = async (sidoCode, sggCode, kinderCode) => {  
  let result;
  const url = 'https://e-childschoolinfo.moe.go.kr/api/notice/safetyEdu.do';
  const key = process.env.KINDERGARDEN_KEY;  
  const requestUrl = url + '?key=' + key + '&sidoCode=' + sidoCode + '&sggCode='+sggCode;  
  result = await axios.get(requestUrl);     
  
  for(let i =0; i<result.data.kinderInfo.length; i++){    
    if(result.data.kinderInfo[i].kindercode == kinderCode){         
      return result.data.kinderInfo[i].cctv_ist_total;
    }
  }
  console.log('false');
  return '0';

}

// 개별 어린이집 api

const eachChildrenApi = async(sggCode = '11680') => {
      let total;
      let array = [];      
      const url = 'http://api.childcare.go.kr/mediate/rest/cpmsapi030/cpmsapi030/request';
      const key = process.env.GARDEN_KEY;
      
      const requestUrl = url + '?key=' + key + '&arcode=' + sggCode;
      
      let result = await axios.get(requestUrl);                                    
             
      if(result.status == 200){          
        let info = parser.xml2json(result.data).response.item;                        
        return info;                  
      }else{
          let message = '에러코드 : ' + result.status + ' 에러 내용 : ' + result.data;
          return message;
      }      
}



//  전국 어린이집 조회
const totalChildrenApi = async(sggCode = '11680') => {
      
    const url = 'http://api.childcare.go.kr/mediate/rest/cpmsapi021/cpmsapi021/request';
    const key = process.env.CARECENTER_KEY;
    
    const requestUrl = url + '?key=' + key + '&arcode=' + sggCode;
    
    let result = await axios.get(requestUrl);                              
    
           
    if(result.status == 200){          
      let json = parser.xml2json(result.data);
      return json;                  
    }else{
        let message = '에러코드 : ' + result.status + ' 에러 내용 : ' + result.data;
        return message;
    }      
}

// 좌표 변환 api

const locationApi = async(address) => {
    
  const key = process.env.LOCATION_KEY;
  const requestUrl = 'http://api.vworld.kr/req/address?service=address&request=getcoord&address=' + encodeURIComponent(address) + '&type=road&key=' + key;
  // console.log(requestUrl);
  let result = await axios.get(requestUrl);                                
  let fakeResult = {};
  if(result.status == 200){         
    if(result.data.response.status == 'NOT_FOUND'){
      fakeResult.x = 0;
      fakeResult.y = 0;
      return fakeResult;
    }
    return result.data.response.result.point; // 좌표만 변환
  }else{
      let message = '에러코드 : ' + result.status + ' 에러 내용 : ' + result.data;
      return message;
  }      
}

exports.requestApi = requestApi;
exports.eachChildrenApi = eachChildrenApi;
exports.totalChildrenApi = totalChildrenApi;
exports.locationApi = locationApi;
exports.isBusChildrenApi = isBusChildrenApi;
exports.cctvNumApi = cctvNumApi;