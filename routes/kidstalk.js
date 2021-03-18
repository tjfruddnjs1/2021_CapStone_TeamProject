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

//kidstalk 메인 페이지
router.get('/', async (req,res)=>{
  try{
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

    res.render('kidstalk/index', {
      posts:posts, 
      currentPage:page, 
      maxPage:maxPage, 
      limit:limit, 
      count:count,
      comment:comment,
      searchType:req.query.searchType,
      searchText:req.query.searchText
    });
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

//글쓰기 페이지 불러오기
router.get('/new', isLoggedIn, async (req,res)=>{
  try{
    res.render('kidstalk/new');
  }catch(err){
    console.error(err);
    next(err);
  }
});

//글쓰기 post 요청
router.post('/new', isLoggedIn, async (req,res)=>{
  try{
    Post.create({
      title : req.body.title,
      body : req.body.body,
      writer : req.user.id,
  });
  res.redirect('/kidstalk');
  }catch(err){
    console.error(err);
    next(err);
  }
});

//글 수정 페이지 get 요청
router.get('/:id/edit', isLoggedIn , async(req,res,next)=>{
  try{
      const post = await Post.findByPk(req.params.id);

      if(post.writer != req.user.id){
        res.send(
          "<script>alert('글 수정 권한은 작성자에게 있습니다.'); history.back();</script>"
        );
      }else{
        res.render('kidstalk/edit', {post : post});
      }
  }catch(err){
      console.error(err);
      next(err);
  }
});

router.route('/:id/comment')
  .post(isLoggedIn, async(req, res, next)=>{
    try{     
      await Comment.create({
        text : req.body.text,
        userNickname : req.user.nickname,
        post : req.params.id
      });
      res.redirect('/kidstalk/'+req.params.id);
    }catch(err){
      console.error(err);
      next(err);
    }
  })

router.route('/:id/comment/:commentId')
  .delete(isLoggedIn, async(req, res, next)=>{
    try{
      const comment = await Comment.findOne({
        where : {id : req.params.commentId}
      });

      if(comment.userNickname == req.user.nickname){
        
        comment.destroy({
          where : {id : req.params.commentId},
        });

        res.redirect('/kidstalk/'+req.params.id);
      }else{
        res.send(
          "<script>alert('댓글 삭제 권한은 작성자에게 있습니다.'); history.back();</script>"
        );
      }
  }catch(err){
      console.error(err);
      next(err);
  }
  });

//게시글 get 요청
router.route('/:id')
    //게시글 show
    .get(async(req,res,next)=>{
      try{
        const post = await Post.findOne(
          {
            include : [
              {
                model : User,
                attributes : ['nickname'],
                required : true,
              }
            ],
            where : {id : req.params.id}
          });

        const comments = await Comment.findAll(
          {
            where : {post : post.id}
          });

        Post.update({
          hits : ++post.hits,
        },{
          where : {id:req.params.id},
        });

        res.render('kidstalk/show', {post:post, comments:comments});
      }catch(err){
        console.error(err);
        next(err);
      }
    })

    //게시글 update
    .put(isLoggedIn, async (req,res,next)=>{
        try{
            req.body.updatedAt = Date.now();
            Post.update({
                title : req.body.title,
                body : req.body.body,
                updatedAt : req.body.updatedAt,
            },{
                where : {id : req.params.id},
            });
            res.redirect('/kidstalk');
        }catch(err){
            console.error(err);
            next(err);
        }
    })

    //게시글 delete
    .delete(isLoggedIn, async(req, res, next)=>{
      try{
        const post = await Post.findOne({
          where : {id : req.params.id}
        });

        if(post.writer == req.user.id){
          Post.destroy({
            where : {id:req.params.id},
          });

          res.send(
            "<script>alert('글이 삭제되었습니다.'); window.location='/kidstalk';</script>"
          );
        }else{
          res.send(
            "<script>alert('글 삭제 권한은 작성자에게 있습니다.'); history.back();</script>"
          );
        }
    }catch(err){
        console.error(err);
        next(err);
    }
    });

module.exports = router;