const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const router = express.Router();

const requestApi = async (sidoCode = '11', sggCode= '11680', currentPage = '1') => {
    let array = [];
    let result;
    const url = 'https://e-childschoolinfo.moe.go.kr/api/notice/basicInfo.do';
    const key = process.env.KINDERGARDEN_KEY;

    const totalUrl = url + '?key=' + key + '&sidoCode=' + sidoCode + '&sggCode='+sggCode;
    result = await axios.get(totalUrl);
    let total = result.data.kinderInfo.length;    
    const requestUrl = url + '?key=' + key + '&sidoCode=' + sidoCode + '&sggCode='+sggCode + '&pageCnt=10&currentPage='+currentPage;

    console.log(requestUrl);    
    result = await axios.get(requestUrl);            

    array['result'] = result;
    array['total'] = total;

    return array;

}

//메인 페이지
router.get('/', async (req,res)=>{
  try{
    let result, total, gardensInfo, info;
    const {sidoCode, sggCode, currentPage} = req.query;    

    if(sidoCode){
        console.log('there');
        result = await requestApi(sidoCode, sggCode, currentPage);
        total = result['total'];
        gardensInfo = result['result'];
        info = gardensInfo.data.kinderInfo;
    }else{        
        result = await requestApi();
        total = result['total'];
        gardensInfo = result['result'];
        info = gardensInfo.data.kinderInfo;        
    }
    res.render('garden/gardenlist', {total : total, info : info});
  }catch(err){
    console.error(err);
    next(err);
  }
});



module.exports = router;