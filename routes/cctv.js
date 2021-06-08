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

//session 유지를 위한 > passport module
router.use((req,res,next)=>{
  res.locals.user = req.user;
  next();
});

 
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
  let domains = [];
  console.log(typeof parentApprove)     
  if(parentApprove){    
    for(let i =0; i < parentApprove.length; i++){
      let domain = await Domain.findOne({
        where : {
          gardencode : parentApprove[i].gardencode
        }
      })
      console.log(domain);
      if(domain) domains.push({ip : domain.ip, port : domain.port, gardencode : domain.gardencode})
    }    
    if(domains.length > 0){      
      const url = domains[0].ip + ':' + domains[0].port;
      const today = new Date();
      const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
      console.log(`http://${url}`);
      console.log(date);
      const result = axios.post(`http://${url}`, {
        params : {date : date}
      })
      console.log(result);      
    }
    res.render('cctv/cctv', {domain : domains[0]});
    // const domain = await Domain.findOne({
    //   where : {
    //     gardencode : parentApprove
    //   }
    // })
  }else{
    res.send(alert('어린이집/유치원 등록 해주시길 바랍니다.', true));
  }   
  }catch(err){
    console.error(err);
  }
});

      


module.exports = router;