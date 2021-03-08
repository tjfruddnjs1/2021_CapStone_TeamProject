const express = require('express');

const router = express.Router();

//메인 페이지
router.get('/', (req,res)=>{
  try{
  res.render('home/index');
  }catch(err){
    console.error(err);
    next(err);
  }
});

//Navigation bar의 킨터가든 버튼 눌렀을 때 
router.get('/index',async(req,res,next)=>{
  try{
    res.render('home/index');
  }catch(err){
    console.error(err);
    next(err);
  }
});

//로그인 눌렀을 때
router.get('/login', async(req,res,next)=>{
  try{
    res.render('home/login');
  }catch(err){
    console.error(err);
    next(err);
  }
});

//회원가입 눌렀을 때
router.get('/auth', async(req,res,next)=>{
  try{ 
    res.render('home/auth');
  }catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;