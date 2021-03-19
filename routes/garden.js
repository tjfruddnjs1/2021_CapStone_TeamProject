const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const router = express.Router();

const apiRouter = require('./api');
const Garden = require('../models/garden');
const SggCode = require('../models/sggcode');
const SidoCode = require('../models/sidocode');
// 유치원 중단
// router.get('/', async (req,res)=>{
//   try{
//     let result, total, gardensInfo, info, info2;
//     const {sidoCode, sggCode, currentPage} = req.query;    

//     if(sidoCode){
//         console.log('there');
//         result = await apiRouter.requestApi(sidoCode, sggCode, currentPage);
//         total = result['total'];
//         gardensInfo = result['result'];
//         info = gardensInfo.data.kinderInfo;
//     }else{        
//         result = await apiRouter.requestApi();
//         total = result['total'];
//         gardensInfo = result['result'];
//         info = gardensInfo.data.kinderInfo;                 
//     }
//     res.render('garden/gardenlist', {total : total, info : info});
//   }catch(err){
//     console.error(err);
//     next(err);
//   }
// });
const paging = (page, total) => {        
        let totalPage = Math.ceil(total / 10);
        let page_size = 10;
        let block = 5;
        let list_page=  5;
        let pageNum = Math.ceil(total/list_page);
        let blockNum = Math.ceil(pageNum/block);
        let nowBlock = Math.ceil(page/block);
        console.log('page : ' + page);
        let s_page = (nowBlock * block) - (block - 1);
        if(s_page<=1) s_page = 1;
        let e_page = nowBlock * block;
        if(pageNum <= e_page) e_page = pageNum;
        
        if(page > totalPage){
          page = 1;
        }        
         result = { 
          "curPage": page,            
          "listPage": list_page, 
          "totalPage": totalPage, 
          "startPage": s_page, 
          "endPage": e_page,           
        } 

        return result;
}



router.get('/', async (req,res)=>{
  try{
    // let result, total, gardensInfo, info, pageCnt;    
    const {sidoCode, sggCode} = req.query;
    const sidos = await SidoCode.findAll({});
    // let sidoecode = req.params;
    // sidocode = (sidocode) ? sidocode : sidos[0].sidocode;
    const sggs = await SggCode.findAll({
      where : {
        sidocode : sidos[0].sidocode,
      }
    });
    let {page} = req.query;
    let offset = 0;                
    let gardens = {};    

    if(!page){
      page = 1;
    }
    if(page > 1){
      offset = 10 * (page - 1);
    }
        
    let pageInfo = [];
    let j = 0;
    if(sggCode){
        console.log('there');
        result = await apiRouter.eachChildrenApi(sggCode);
        info = result['info'];
        total = result['total'];
    }else{   
        console.log('here');
        gardens = await Garden.findAndCountAll({
          offset : offset,
          limit : 10
        });                
        result = paging(page, gardens.count);                                                                   
    }                
    res.render('garden/gardenlist', {total : gardens.count , info : gardens.rows, page : result, sidos : sidos});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/sggname', async(req, res) => {
  try{
    const {sidocode} = req.query;
    if(sidocode){
      console.log(sidocode);
      const sggCode = await SggCode.findAll({
        where : {
          sidocode : sidocode
        }
      });      
      res.send(sggCode);
    }
        
    res.send('데이터가 없습니다.');
  }catch(err){
    console.error(err);
  }
});

router.post('/search', async(req, res) => {
  
})



module.exports = router;