const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();
const User = require('../models/user');
const Review = require('../models/review');

//session 유지를 위한 > passport module
router.use((req,res,next)=>{
  res.locals.user = req.user;
  next();
});

//리뷰 메인 페이지
router.get('/', (req,res)=>{
  try{
  res.render('temp/review');
  }catch(err){
    console.error(err);
    next(err);
  }
});

//리뷰 post 요청
router.post('/',isLoggedIn, async(req,res,next)=>{
    try{
        const { teacherName, attendTime, attendTimeDirect, reJoin, isCommunicate, isActive, isSafe, advantage, disAdvantage } = req.body;

        if(attendTime == "dircet"){
            await Review.create({
                teacherName : teacherName,
                attendTime : attendTimeDirect,
                reJoin : reJoin,
                isCommunicate : isCommunicate,
                isActive : isActive,
                isSafe : isSafe,
                advantage : advantage,
                disAdvantage : disAdvantage,
                userNickname : req.user.nickname
            });
            res.send(
                "<script>alert('리뷰가 작성되었습니다.'); window.location='/';</script>"
            );
        }else{
            await Review.create({
                teacherName : teacherName,
                attendTime : attendTime,
                reJoin : reJoin,
                isCommunicate : isCommunicate,
                isActive : isActive,
                isSafe : isSafe,
                advantage : advantage,
                disAdvantage : disAdvantage,
                userNickname : req.user.nickname
            });
            res.send(
                "<script>alert('리뷰가 작성되었습니다.'); window.location='/';</script>"
            );
        }   
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;