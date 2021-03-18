const Sequelize = require("sequelize");
const User = require('./user');
const Drop = require('./drop');
const Post = require('./post');
const Comment = require('./comment');

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

User.init(sequelize);
Drop.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Drop.associate(db);
Post.associate(db);
Comment.associate(db);

module.exports = db;