const express = require('express');
const router = express.Router();
const Garden = require('../models/garden');
const SggCode = require('../models/sggcode');
const SidoCode = require('../models/sidocode');
const Request = require('../models/request');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const sequelize = require('sequelize');
const { cctvNumApi } = require('./api');
const Op = sequelize.Op;

//session 유지를 위한 > passport module
router.use((req,res,next)=>{
  res.locals.user = req.user;
  next();
});

// upload 폴더 생성
try{
  fs.readdirSync('public/images/gardens');        
}catch(error){
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('public/images/gardens');
}

// 파일 관리 
const upload = multer({
  storage: multer.diskStorage({
      destination(req,file, done){
          done(null, 'public/images/gardens');

upload.single('image')
      },
      filename(req, file, done){
          const ext = path.extname(file.originalname);
          done(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
  }),
  limits : {fileSize : 5 * 1024 * 1024},
});

const findRequest = async (whereQuery) => {

    // let createWhere = {};
    // for(const [key, value] of Object.entries(whereQuery)){
    //     createWhere[key] = value;
    // }    
    const gardenApprove = await Request.findAll({
        include : [
            {model : Garden, attributes : ['gardenname', 'address']},
        ],
        where : whereQuery
    }); 
           
    return gardenApprove;
}

const alert = (comment, back = false, redirect = null) => {
  let alert = `<script>alert("${comment}")</script>`;
  if(back){
    alert = `<script>alert("${comment}"); history.back()</script>`;
  }
  if(redirect){
    alert = `<script>alert("${comment}"); location.href = "${redirect}"</script>`;
  }
  
  return alert;
}

// 가든 추가 등록 페이지
router.get('/', isLoggedIn, async (req,res)=>{
  try{  
    const userId = req.user.id;
    let whereQuery = {
        userId : userId,
        isapprove : 1,
        requesttype : 'garden',          
    };    

    let gardenApprove = await findRequest(whereQuery);       
    
    if(gardenApprove.length <= 0){      
      res.send(alert('가든 등록을 해야 합니다.', false, '/register'));
    }

    res.render('mypage/gardenManageInfo', {requestInfo : gardenApprove});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/', upload.single('image'), isLoggedIn, async (req,res)=>{
  try{  
    const {id, type, gardencode, representative, gardenphone, intro} = req.body;                  
    const userId = req.user.id;     
    let updateQuery = {
      gardentype : type,            
      representative,     
      gardencode, 
      gardenphone,            
      gardenintro : intro,
    }
    if(req.file){
      let route = req.file.path;   // 파일 경로   
      route = route.replace('/\\/g', '\/');
      route = route.replace('public', '');
      updateQuery.gardenimage = route;
    }

    await Request.update(updateQuery,{
      where : {
        id : id,        
      },
    });    
    res.send(alert('수정 되었습니다', false, '/mypage/gardenManage/info'));    
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/garden', isLoggedIn, async (req,res)=>{
    try{  
      const userId = req.user.id;
      const {gardenCode} = req.body;       
      let whereQuery = {          
          userId : userId,
          isapprove : 1,
          requesttype : 'garden', 
          gardencode : gardenCode         
      };
  
      let gardenApprove = await findRequest(whereQuery);         
      res.send(gardenApprove);
    }catch(err){
      console.error(err);
      next(err);
    }
});



module.exports = router;