const Sequelize = require("sequelize");
const User = require('./user');
const Drop = require('./drop');

const Post = require('./post');
const Comment = require('./comment');

const SggCode = require('./sggcode');
const SidoCode = require('./sidocode');
const Garden = require('./garden');
const Domain = require('./domain');
const Review = require('./review');

const Request = require('./request');

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.Drop = Drop;
db.Post = Post;
db.Comment = Comment;
db.SidoCode = SidoCode;
db.SggCode = SggCode;
db.Garden = Garden;
db.Review = Review;
db.Request = Request;
db.Domain = Domain;

User.init(sequelize);
Drop.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
SidoCode.init(sequelize);
SggCode.init(sequelize);
Garden.init(sequelize);
Review.init(sequelize);
Request.init(sequelize);
Domain.init(sequelize);

User.associate(db);
Drop.associate(db);
Post.associate(db);
Comment.associate(db);
SidoCode.associate(db);
SggCode.associate(db);
Garden.associate(db);
Review.associate(db);
Request.associate(db);
Domain.associate(db);

module.exports = db;