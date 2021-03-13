const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const dotenv = require('dotenv');

const { sequelize } = require('./models');

const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');
const gardenRouter =require('./routes/garden');

const app = express();
dotenv.config();

app.set('port', process.env.PORT || 8000);
app.set('view engine', 'ejs');

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(methodOverride('_method'));

app.use('/',homeRouter);
app.use('/login', loginRouter);
app.use('/garden', gardenRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});
  
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  console.log(err.status +' error 발생')
})

let server = app.listen(app.get('port'), ()=> {
  console.log(app.get('port'), '번 포트에서 대기중');
});