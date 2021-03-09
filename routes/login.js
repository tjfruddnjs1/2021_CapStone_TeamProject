const express = require('express');

const router = express.Router();

//로그인 눌렀을 때
router.get('/', async(req,res,next)=>{
    try{
      res.render('auth/login');
    }catch(err){
      console.error(err);
      next(err);
    }
  });
  
  //회원가입 눌렀을 때
  router.get('/regist', async(req,res,next)=>{
    try{ 
      res.render('auth/regist');
    }catch(err){
      console.error(err);
      next(err);
    }
  });

module.exports = router;
