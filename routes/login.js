const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const User = require('../models/user');

const router = express.Router();

//session 유지를 위한 > passport module
router.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
  });

//로그인 눌렀을 때
  router.get('/', async(req,res,next)=>{
    try{
      res.render('auth/login');
    }catch(err){
      console.error(err);
      next(err);
    }
  });

//로그인 post 요청

//회원가입 눌렀을 때
  router.get('/regist', async(req,res,next)=>{
    try{ 
      res.render('auth/regist');
    }catch(err){
      console.error(err);
      next(err);
    }
  });

//회원 가입 post 요청
router.post('/regist', isNotLoggedIn, async (req, res, next) => {
    const { email, nickname, password } = req.body;
    try {
    const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        res.send(
            "<script>alert('가입된 중복된 메일이 존재합니다.'); history.back(); </sciprt>"
        );
      }
      const hash = await bcrypt.hash(password, 12);
      await User.create({
        email,
        nickname,
        password: hash,
      });
      res.send(
          "<script>alert('정상적으로 회원가입 되었습니다.'); window.location='/'</script>"
      );
    } catch (error) {
      console.error(error);
      return next(error);
    }
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/auth/login',
}), (req, res) => {
  res.redirect('/');
});

router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback', passport.authenticate('naver', {
  failureRedirect: '/auth/login',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
