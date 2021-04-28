const express = require('express');

const Garden = require('../models/garden');
const SggCode = require('../models/sggcode');
const SidoCode = require('../models/sidocode');
const User = require('../models/user');
const Request = require('../models/request');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const sequelize = require('sequelize');
const Op = sequelize.Op;

const router = express.Router();


router.use((req,res,next)=>{
  res.locals.user = req.user;  
  next();
});

const allSido = async () => {
  const sidoCode = await SidoCode.findAll({});  
  return sidoCode;  
}

const findAllSgg = async (sidoCode) => {
  const sggCode = await SggCode.findAll({
    where : {
      sidocode : sidoCode
    }
  });
  return sggCode;
}

const findGardens = async (page, type, sggCode, pathName = null, gardenName = null) => {
  let gardens = {};    
  let block = 5;
  let list = 5;    
  let total;  
  
if(pathName){
  total = await Garden.count({
    where : {    
      gardentype : type,        
      sggcode : {[Op.like] : sggCode + '%' },       
      address : {[Op.like] : '%' + pathName + '%'},
    }
  });        
}else{  
  total = await Garden.count({
    where : {    
      gardentype : type,        
      sggcode : {[Op.like] : sggCode + '%' },       
      gardenname : {[Op.like] : '%' + gardenName + '%'},
    }
  });        
}
  
  if(page <=1){
    page = 1;
  }   
  let pageNum = Math.ceil(total/list); // 총 페이지수
  console.log(pageNum);
  let blockNum = Math.ceil(pageNum/block); // 총 블록 수
  let nowBlock = Math.ceil(page/block);  
  if(nowBlock >= blockNum){
    nowBlock = blockNum;
  }else if(nowBlock <=0){
    nowBlock = 1;
  }

  let s_page = (nowBlock * block) - (block - 1);

  if(s_page <= 1){
    s_page = 1;
  }

  let e_page = nowBlock * block;

  if(pageNum <= e_page){    
    e_page = pageNum;
  }  
  let s_point = (page-1) * list;
  if(s_point <=0){
    s_point = 0;
  }else if(s_point > total){
    s_point = s_point - list*(page-2);
  }  
  if(pathName){
    gardens = await Garden.findAndCountAll({
      attributes : ['gardencode', 'address', 'gardenname'],
      offset : s_point,
      limit : 5,
      where : {    
        gardentype : type,        
        sggcode : {[Op.like] : sggCode + '%' },       
        address : {[Op.like] : '%' + pathName + '%'},
      }
     
    });     
  }else{
    gardens = await Garden.findAndCountAll({
      attributes : ['gardencode','address', 'gardenname'],
      offset : s_point,
      limit : 5,
      where : {    
        gardentype : type,        
        sggcode : {[Op.like] : sggCode + '%' },       
        gardenname : {[Op.like] : '%' + gardenName + '%'},
      }
     
    });    
  }
      
  
        result = { 
          "curPage": page,            
          "listPage": block, 
          "totalPage": pageNum, 
          "startPage": s_page, 
          "endPage": e_page,    
          "gardens" : gardens,                       
        } 
         
  return result;
}


//메인 페이지
router.get('/', async (req,res)=>{
  try{          
    res.render('register/');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/garden',  isLoggedIn, async (req,res)=>{
  try{  
  const user = req.user;
  if(!user.phone){
    res.send('<script>alert("핸드폰 인증이 필요합니다"); location.href = "/mypage/account";</script>')
  }
    
  res.render('register/gardenRegister', {phone : user.phone, nickName : user.nickname});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/garden', isLoggedIn,  async (req,res)=>{
  try{  
    const {type, gardencode, representative, gardenphone} = req.body;
    const user = req.user;

    const category = 'garden';

    const request = await Request.create({
      gardentype : type,      
      requesttype : 'garden',
      representative,      
      gardenphone,
      userId : user.id,
      gardencode,      
    });


  res.render('register/complete', {category : category});
  }catch(err){
    console.error(err);
    next(err);
  }
});

//enrollGarden 메인 페이지
router.get('/enrollGarden', isLoggedIn, async (req,res)=>{
  try{
      if(req.user.email != "tjfruddnjs12@naver.com"){
          res.send(
              "<script>alert('해당 라우터에 접근할수 없습니다.'); window.location='/home';</script>"
          )
      }else{
          let page = Math.max(1, req.query.page);
          let limit = Math.max(1, req.query.limit);
          page = !isNaN(page)?page:1;
          limit = !isNaN(limit)?limit:10;
      
          let searchQuery = createSearchQuery(req.query);
      
          console.log(JSON.stringify(searchQuery));
      
          let offset = (page-1)*limit;
          let count = await Request.findAndCountAll({where : searchQuery});
          //count.count 로 사용 > 전체 개시물 수
      
          console.log(searchQuery);
      
          let maxPage = Math.ceil(count.count/limit);
      
          const posts = await Request.findAll({
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
              where : searchQuery,
              order : [["createdAt", "DESC"]],
              offset : offset,
              limit : limit,
          });

          console.log(posts);
      
          res.render('admin/enrollGarden', {
            posts:posts, 
            currentPage:page, 
            maxPage:maxPage, 
            limit:limit, 
            count:count,
            searchType:req.query.searchType,
            searchText:req.query.searchText
          });
      }
  }catch(err){
    console.error(err);
    next(err);
  }
});

function createSearchQuery(queries){
  var searchQuery = {};
  if(queries.searchType && queries.searchText && queries.searchText.length >= 3){
    let searchTypes = queries.searchType.toLowerCase().split(',');
    let postQueries = [];
    if(searchTypes.indexOf('gardenname')>=0){
      postQueries.push({ gardenname : {[Op.like] : '%'+queries.searchText+'%'} });
    }
    if(searchTypes.indexOf('writer')>=0){
      postQueries.push({ writer : {[Op.like] : '%'+queries.searchText+'%'} });
    }
    if(searchTypes.indexOf('representative')>=0){
      postQueries.push({ representative : {[Op.like] : '%'+queries.searchText+'%'} });
    }
    if(postQueries.length > 0) searchQuery = postQueries;
  }
  return searchQuery;
}

router.route('/enrollGarden/:id')
    //게시글 show
    .get(async(req,res,next)=>{
    try{
        if(req.user.email != "tjfruddnjs12@naver.com"){
          res.send(
              "<script>alert('해당 라우터에 접근할수 없습니다.'); window.location='/home';</script>"
          )
        }else{
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

          res.render('admin/enrollGardenContent', {post:post});
        }
      }catch(err){
        console.error(err);
        next(err);
      }
    })

router.post('/enrollGarden/:id', isLoggedIn, async(req,res)=>{
  try{
    if(req.user.email != "tjfruddnjs12@naver.com"){
      res.send(
          "<script>alert('해당 라우터에 접근할수 없습니다.'); window.location='/home';</script>"
      )
    }else{
      await Request.update({
        isapprove : true,
        completedAt : Date.now(),
      },{
        where : {id:req.params.id},
      });
      
      res.redirect('/register/enrollGarden');
    }
  }catch(err){
    console.error(err);
    next(err);
  }
})

router.post('/enrollGarden/:id/reject', isLoggedIn, async(req,res)=>{
  try{
    if(req.user.email != "tjfruddnjs12@naver.com"){
      res.send(
          "<script>alert('해당 라우터에 접근할수 없습니다.'); window.location='/home';</script>"
      )
    }else{
      await Request.update({
        isapprove : false,
        completedAt : Date.now(),
      },{
        where : {id:req.params.id},
      });
      
      res.redirect('/register/enrollGarden');
    }
  }catch(err){
    console.error(err);
    next(err);
  }
})

router.get('/parent', isLoggedIn, async (req,res)=>{
  try{  
    const user = req.user;
    if(!user.phone){
      res.send('<script>alert("핸드폰 인증이 필요합니다"); location.href = "/mypage/account";</script>')
    }
  res.render('register/parentRegister', {phone : user.phone, nickName : user.nickname});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/parent',isLoggedIn,  async (req,res)=>{
  try{  
    const {type, gardencode, childName} = req.body;
    const user = req.user;
    const category = 'parent';
    const request = await Request.create({
      gardentype : type,
      requesttype : 'parent',            
      childName,       
      userId : user.id,     
      gardencode,
    });



  res.render('register/complete', {category : category});
  }catch(err){
    console.error(err);
    next(err);
  }
});

// router.post('/garden',isLoggedIn,  async (req,res)=>{
//   try{  
      
//   res.render('register/complete');
//   }catch(err){
//     console.error(err);
//     next(err);
//   }
// });

router.get('/agree',isLoggedIn, async (req,res)=>{
  try{    
    res.render('register/agree');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/address',isLoggedIn, async (req,res)=>{
  try{  
    const sidos = await allSido();
  res.render('register/address', {sidos : sidos});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/address',isLoggedIn, async (req, res) => {
  try{
    const {sidoCode} = req.body;    
    const sggs = await findAllSgg(sidoCode);
    res.send({sggs : sggs});
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/address/gardens/:page?', isLoggedIn, async (req, res) => {
  try{
    const {type, sggCode, pathName, gardenName} = req.body;    
    let {page} = req.params;        
    if(!page){
      page = 1;
    }    
    if(page > 1){
      offset = 10 * (page - 1);
    }    
    console.log(gardenName);
    const gardens = await  findGardens(page, type, sggCode, pathName, gardenName);    
    res.send({result : gardens});
  }catch(err){
    console.error(err);    
  }
});



module.exports = router;