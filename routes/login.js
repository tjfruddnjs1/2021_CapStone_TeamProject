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
router.get('/local', async(req,res,next)=>{
    try{
      res.render('auth/login');
    }catch(err){
      console.error(err);
      next(err);
    }
  });

//로그인 post 요청
router.post('/local', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }

    //info.message
    if (!user) {
      console.log(info.message);
      res.send(
        "<script>alert('로그인 정보를 확인해주세요');history.back();</script>" 
      );
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

//비밀번호 찾기
router.get('/searchPassword',isNotLoggedIn,(req,res,next)=>{
  try{
    res.render('auth/searchPassword');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/searchPassword',isNotLoggedIn, async(req,res,next)=>{
  try{
    const email = req.body.email;
    let random = Math.random().toString(12).slice(2);
    const hash = await bcrypt.hash(random,12);
    const isUser = await User.findOne({where:{email : req.body.email}});

    if(!isUser){
      res.send(
        "<script>alert('존재하지 않는 이메일입니다.'); history.back();</script>"
        )
    }else{
      if(isUser.provider != 'local'){
        res.send(
          "<script>alert('카카오톡, 네이버 이메일은 비밀번호 찾기가 불가합니다.'); history.back();</script>"
          )
      }else{
        await User.update({
          password : hash,
        },{
          where : {email : req.body.email},
        });
      }
    }
  
    let transporter = nodemailer.createTransport({
      service: 'gmail'              
      , prot: 587
      , host: 'smtp.gmail.com'
      , secure: false
      , requireTLS: true
      , auth: {
          user: process.env.NODEMAIL_USER                      
          , pass: process.env.NODEMAIL_PASS               
        }
      });
  
    let info = transporter.sendMail({   
      from: '키즈가든(KidsGarden)',                            
      to: email,                                                
      subject: '[키즈가든] 새로운 비밀번호 전송',                  
      html : "<p>새로운 비밀번호 입니다.</p><p>아래의 비밀번호를 통해 로그인 한후 <b>마이페이지 > 나의계정 > 비밀번호 설정</b> 을통해 비밀번호를 변경해주세요</p><h2>"+random+"</h2>"                     //내용
    });

    res.send(
      "<script>alert('새 비밀번호가 전송되었습니다.'); window.location='/login'</script>"
    );
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

//회원 가입 post 요청
router.post('/regist', isNotLoggedIn, async (req, res, next) => {
    const { email, nickname, password } = req.body;
    try {
    const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        res.send(
            "<script>alert('가입된 중복 메일이 존재합니다.'); window.location='/login/regist'; </script>"
        );
      }

      const hash = await bcrypt.hash(password, 12);
      await User.create({
        email,
        nickname,
        password: hash,
      });
      res.send(
          "<script>alert('정상적으로 회원가입 되었습니다.'); window.location='/login';</script>"
      );
      
    } catch (error) {
      console.error(error);
      return next(error);
    }
});

//회원가입 이메일 인증
router.post('/sendEmail', isNotLoggedIn, async(req,res,next)=>{
  
  let email = req.body.email;

  let randomNumber = req.body.randomNumber;

  let transporter = await nodemailer.createTransport({
    service: 'gmail'            
    , prot: 587
    , host: 'smtp.gmail.com'
    , secure: false
    , requireTLS: true
    , auth: {
        user: process.env.NODEMAIL_USER                     
        , pass: process.env.NODEMAIL_PASS               
      }
    });

  let info = await transporter.sendMail({   
    from: '키즈가든(KidsGarden)',                      
    to: email,                              
    subject: '[키즈가든] 이메일 인증 요청',                 
    html : "<p>회원 가입을 위한 인증번호 입니다.</p><p>아래의 인증 번호를 입력하여 인증을 완료해주세요.</p><h2>"+randomNumber+"</h2>"                 
  });
});

//logout 기능 처리
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });

//kakao 로그인을 위한 passport
router.get('/kakao', passport.authenticate('kakao'));

//kakao 로그인 실패시 연결
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

//naver 로그인을 위한 passport
router.get('/naver', passport.authenticate('naver'));

//kakao 로그인 실패시 연결
router.get('/naver/callback', passport.authenticate('naver', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
