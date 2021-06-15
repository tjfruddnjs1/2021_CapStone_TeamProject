const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const router = express.Router();

const apiRouter = require('./api');
const Garden = require('../models/garden');
const SggCode = require('../models/sggcode');
const SidoCode = require('../models/sidocode');
const User = require('../models/user');
const Review = require('../models/review');
const Request = require('../models/request');
const Domain = require('../models/domain');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const sequelize = require('sequelize');
const Op = sequelize.Op;

//session 유지를 위한 > passport module
router.use((req,res,next)=>{
  res.locals.user = req.user;
  next();
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

 
router.get('/', isLoggedIn, async(req, res) => {
  try{  
    const userId = req.user.id;
    const parentApprove = await Request.findAll({ // 이름           
        include : [
            {model : Garden, attributes : ['gardenname']},                                           
        ],
        where : {
            userId : userId,
            isapprove : 1,
            requesttype : 'parent',
        }

    });            
  if(parentApprove){            
      let domain = await Domain.findOne({        
        where : {
          gardencode : parentApprove[0].gardencode
        }
      })                
      let url = domain.ip + ':' + domain.port;
    
      console.log(url);
    res.render('cctv/realtime', {url : url, gardens : parentApprove});

  }else{
    res.send(alert('어린이집/유치원에 등록 해주시길 바랍니다.', true));
  }    
  }catch(err){
    console.error(err);
  }
});

      


module.exports = router;