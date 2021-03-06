const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AT;
const client = require('twilio')(accountSid, authToken);

const User = require('../models/user');
const Garden = require('../models/garden');
const Drop = require('../models/drop');
const Request = require('../models/request');
const Domain = require('../models/domain');

//session 유지를 위한 > passport module
router.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
});


// upload 폴더 생성
try{
    fs.readdirSync('public/images/user_image');        
}catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('public/images/user_image');
}

// 파일 관리 
const upload = multer({
    storage: multer.diskStorage({
        destination(req,file, done){
            done(null, 'public/images/user_image');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits : {fileSize : 5 * 1024 * 1024},
});

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

router.get('/connect', isLoggedIn, async (req,res,next)=>{
    try{
        const userId = req.user.id;
        const gardenApprove = await Request.findAll({ // 이름           
            include : [
                {model : Garden, attributes : ['gardenname']},                                           
            ],
            where : {
                userId : userId,
                isapprove : 1,
                requesttype : 'garden',
            }
        }); 
        const domain = await Domain.findOne({
            where : {gardencode : gardenApprove[0].gardencode}
        });
        if(domain){
            let ip = domain.ip.split('.');        
            domain.ip = ip;
        }        
        res.render('mypage/connect', {gardens : gardenApprove, domain : domain});
        
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/connect', isLoggedIn, async (req,res,next) => {
    try{
        const {ip1, ip2, ip3, ip4, port, gardenCode} = req.body;
        const ip = ip1 + '.' + ip2 + '.' + ip3 + '.' + ip4;
        const findGarden = await Domain.findOne({
            where  : {gardencode : gardenCode},
        });
        if(findGarden){
            await Domain.update({
                ip : ip,
                port : port,                            
            }, {where : {gardencode : gardenCode}});
            res.send(alert('수정 되었습니다.', true));            
        }else{
            const result = await Domain.create({
                ip : ip,
                port : port,
                gardencode : gardenCode,
            });
            res.send(alert('등록 되었습니다.', true));            
        }          
    }catch(err){
        console.error(err);
        next(err);
    }   
})



// router.get('/post',isLoggedIn,(req,res,next)=>{
//     try{
//         res.render('mypage/connect');
//     }catch(err){
//         console.error(err);
//         next(err);
//     }
// });

//계정 설정 page get/post
router.get('/account',isLoggedIn,(req,res,next)=>{
    try{
        res.render('mypage/account');
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/account',isLoggedIn, upload.single('upload'), async(req,res,next)=>{
    const { nickname, phone, gender} = req.body;
    const exUser = await User.findOne({where : { nickname : nickname }});

    try{
        if(! req.file || ! req.file.path){
            if((exUser == null) || (req.body.nickname == req.user.nickname)){
                await User.update({
                    nickname : nickname,
                    phone : phone,
                    gender : gender,
                },{
                    where:{id : req.user.id},
                });

                return res.send(
                    "<script>alert('정보가 수정 되었습니다.'); history.back();</script>"
                );
            }else if(exUser.nickname != req.user.nickname){
                return res.send(
                    "<script>alert('닉네임 중복확인을 해주세요.');history.back();</script>"
                )
            }
        }else{
            let path = req.file.path;
            path = path.replace('public','');

            if((exUser == null) || (req.body.nickname == req.user.nickname)){
                await User.update({
                    nickname : nickname,
                    phone : phone,
                    gender : gender,
                    path : path,
                },{
                    where:{id : req.user.id},
                });

                return res.send(
                    "<script>alert('정보가 수정 되었습니다.'); history.back();</script>"
                );
            }else if(exUser.nickname != req.user.nickname){
                return res.send(
                    "<script>alert('닉네임 중복확인을 해주세요.');history.back();</script>"
                )
            }
        }        
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/status',isLoggedIn, async (req,res,next)=>{
    try{
        if(req.user.phone){
        const posts = await Request.findAll({
            where : {userId : req.user.id},
        });

        const gardenApprove = await Request.findAll({
            where : {requesttype: 'garden', isapprove : true, userId : req.user.id},
        });

        const parentApprove = await Request.findAll({
            where : {requesttype: 'parent', isapprove : true, userId : req.user.id},
        });

        res.render('mypage/status', {
            posts : posts, 
            gardenApprove : gardenApprove,
            parentApprove : parentApprove,
        });
    }else{
        res.send(
            "<script>alert('핸드폰 등록이 필요한 서비스입니다.');history.back();</script>"
        )
    }

    }catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/duplicated', isLoggedIn, upload.single('upload'), async(req,res,next)=>{
    try{
      const nickname = req.body.nickname;
      const exUser = await User.findOne({where : { nickname : nickname }});
  
      if(exUser == null){
        return await res.send(
          "<script>alert('사용 가능한 닉네임입니다.');history.back();</script>"
        )
      }

      if(exUser.nickname == req.user.nickname) {
        res.send(
            "<script>alert('기존 사용하던 닉네임은 사용 가능합니다.');history.back();</script>"
        )
      }else if(exUser.nickname != req.user.nickname){
        res.send(
            "<script>alert('가입된 닉네임이 존재합니다.');history.back();</script>"
        )
      }

      
      
    }catch(error){
      console.error(error);
      return next(error);
    }
  });

//핸드폰 인증번호 발송
router.post('/sendPhone', upload.any(), isLoggedIn, async (req,res,next)=>{
    try{
        let phone = req.body.phone;
        let phoneToKor = '+82'+phone.substring(1,11);

        await client.messages.create({
            body: '[키즈가든] 인증번호 '+req.body.randomNumber+'를 입력해주세요.',
            from : process.env.TWILIO_FROM,
            to: phoneToKor
        })
            .then(message=>console.log(message.sid));
    }catch(err){
        console.error(err);
        next(err);
    }
});

//계정 삭제 get,post
router.get('/delete',isLoggedIn,(req,res,next)=>{
    try{
        res.render('mypage/delete');
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/delete', isLoggedIn, async(req,res,next)=>{
    try{
        await Drop.create({
           email : req.user.email,
           reason : req.body.drop,
           etc : req.body.etc,
        });

        await User.destroy({
            where : {email : req.user.email}
        });
        
        res.send(
            "<script>alert('정상적으로 탈퇴되었습니다.'); window.location='/'</script>"
        );
    }catch(err){
        console.error(err);
        next(err);
    }
})

//비밀번호 변경
router.get('/changePassword',isLoggedIn, async(req,res,next)=>{
    try{
        const user = await User.findOne({where : {email : req.user.email}});
        if(user.provider != 'local'){
            res.send(
            "<script>alert('카카오톡, 네이버 로그인은 비밀번호 변경이 불가능합니다.'); history.back();</script>"
            )
        }else{
            res.render('mypage/changePassword');
        }   
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.post('/changePassword',isLoggedIn,async(req,res,next)=>{
    try{
        const {current_password, new_password} = req.body;
        const hash = await bcrypt.hash(new_password, 12);
        const isUser = await User.findOne({where: {email : req.user.email}});
        const result = await bcrypt.compare(current_password, isUser.password);

        if(result){
            await User.update({
                password : hash,
            },{
                where: {id:req.user.id},
            });
            res.send(
                "<script>alert('비밀번호가 변경되었습니다.'); window.location='/'</script>"
            );
        }else{
            res.send(
                "<script>alert('현재 비밀번호를 확인해주세요.'); history.back();</script>"
            );
        }
        
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/gardenApprove',isLoggedIn, async(req,res,next)=>{
    try{
        const isApprove = await Request.findAndCountAll({where : {
            userId : req.user.id,
            requesttype : 'garden',
            isApprove : true,
            }}
        );

        if(isApprove.count >= 1){
            let page = Math.max(1, req.query.page);
            let limit = Math.max(1, req.query.limit);
            page = !isNaN(page)?page:1;
            limit = !isNaN(limit)?limit:10;

            let offset = (page-1)*limit;
            let count = isApprove.count;
            let gardencode = req.query.gardencode;
            // console.log(gardencode);
            //count.count 로 사용 > 전체 개시물 수

            let maxPage = Math.ceil(count/limit);

            const posts = await Request.findAll({
                include : [
                    {
                        model : User,
                        attributes : ['nickname'],
                        required : true,
                    },
                    {
                        model : Garden,
                        required: true,
                    }
                ],
                order : [["createdAt", "DESC"]],
                offset : offset,
                limit : limit,
            });

            res.render('mypage/gardenApprove', {
                posts : posts,
                currentPage:page, 
                maxPage:maxPage, 
                limit:limit, 
                count:count,
                gardencode : gardencode,
            });
        }else{
            res.send(
                "<script>alert('유치원/어린이집 인증 후 사용가능한 페이지 입니다.'); history.back();</script>"
            );
        }

    }catch(err){
        console.error(err);
        next(err);
    }
});

router.route('/gardenApprove/:id')
    //게시글 show
    .get(async(req,res,next)=>{
    try{
          const post = await Request.findOne(
            {
              include : [
                {
                  model : Garden,
                  required : true,
                },
                {
                  model : User,
                  required : true,
                }
              ],
              where : {id : req.params.id}
            });

          res.render('mypage/gardenApproveContent', {post:post});
      }catch(err){
        console.error(err);
        next(err);
      }
    })

    .post(async(req,res,next)=>{
        try{

            const post = await Request.findOne(
                {
                  include : [
                    {
                      model : Garden,
                      required : true,
                    },
                    {
                      model : User,
                      required : true,
                    }
                  ],
                  where : {id : req.params.id}
                });

            await Request.update({
                isapprove : true,
                completedAt : Date.now(),
              },{
                where : {id:req.params.id},
              });
              
              res.redirect('/mypage/gardenApprove?gardencode='+post.gardencode);
        }catch(err){
            console.log(err);
            next(err);
        }
    });

    router.post('/gardenApprove/:id/reject', isLoggedIn, async(req,res)=>{
        try{
            const post = await Request.findOne(
                {
                  include : [
                    {
                      model : Garden,
                      required : true,
                    },
                    {
                      model : User,
                      required : true,
                    }
                  ],
                  where : {id : req.params.id}
                });
            
            await Request.update({
              isapprove : false,
              completedAt : Date.now(),
            },{
              where : {id:req.params.id},
            });
            
            res.redirect('/mypage/gardenApprove?gardencode='+post.gardencode);
        }catch(err){
          console.error(err);
          next(err);
        }
      })    

      router.post('/connect/:gardenCode', isLoggedIn, async (req,res,next) => {
        try{
            const gardenCode = req.params.gardenCode;            
            const domain = await Domain.findOne({
                where  : {gardencode : gardenCode},
            });                       
            if(domain){
                const ip = domain.ip.split('.');
                domain.ip = ip;
                console.log(domain);
            }
                        
            res.send(domain);                       
        }catch(err){
            console.error(err);
            next(err);
        }   
    })

module.exports = router;