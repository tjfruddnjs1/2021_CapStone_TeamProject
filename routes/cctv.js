const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const router = express.Router();

const Garden = require('../models/garden');
const Request = require('../models/request');
const Domain = require('../models/domain');

const { isLoggedIn } = require('./middlewares');

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

function getToday(){
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
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
  let fileList =  null;
  let url = null;
  console.log(isNaN(Object.keys(req.query)[0]));
  let selectDate = Object.keys(req.query).length == 0 ?getToday():Object.keys(req.query)[0];

  if(parentApprove){        
    for(let i =0; i < parentApprove.length; i++){
      let domain = await Domain.findOne({        
        where : {
          gardencode : parentApprove[i].gardencode
        }
      })      
      if(domain) domains.push({ip : domain.ip, port : domain.port, gardencode : domain.gardencode})
    }    
    if(domains.length > 0){
      url = 'http://' + domains[0].ip + ':' + domains[0].port ;
      
      console.log(selectDate);
      fileList = await axios.post(`${url}/cctv`, {
        date : selectDate,
      })
      
      console.log(fileList);
      selectDate = selectDate.replace(/\D/g, '/');  
    }    
    res.render('cctv/cctv', {url : url, fileList : fileList, gardens : parentApprove, selectDate : selectDate});

  }else{
    res.send(alert('어린이집/유치원 등록 해주시길 바랍니다.', true));
  }   
  }catch(err){
    console.error(err);
  }
});

module.exports = router;