const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

const router = express.Router();

//session 유지를 위한 > passport module
router.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
});

//enrollGarden 메인 페이지
router.get('/index', isLoggedIn, async (req,res)=>{
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
            let count = await Post.findAndCountAll({where : searchQuery});
            //count.count 로 사용 > 전체 개시물 수
        
            console.log(searchQuery);
        
            let maxPage = Math.ceil(count.count/limit);
        
            const posts = await Post.findAll({
                include : [
                  {
                    model : User,
                    attributes : ['nickname'],
                    required : true,
                  }
                ],
                where : searchQuery,
                order : [["createdAt", "DESC"]],
                offset : offset,
                limit : limit,
            });
        
            let comment = await Comment.findAll({});
        
            res.render('admin/enrollGarden', {
              posts:posts, 
              currentPage:page, 
              maxPage:maxPage, 
              limit:limit, 
              count:count,
              comment:comment,
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
      if(searchTypes.indexOf('title')>=0){
        postQueries.push({ title : {[Op.like] : '%'+queries.searchText+'%'} });
      }
      if(searchTypes.indexOf('body')>=0){
        postQueries.push({ body : {[Op.like] : '%'+queries.searchText+'%'} });
      }
      if(postQueries.length > 0) searchQuery = postQueries;
    }
    return searchQuery;
  }
  

  module.exports = router;