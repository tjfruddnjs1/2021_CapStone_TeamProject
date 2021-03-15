const Sequelize = require("sequelize");
const User = require('./user');
const Drop = require('./drop');
const Post = require('./post');

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

User.init(sequelize);
Drop.init(sequelize);
Post.init(sequelize);

User.associate(db);
Drop.associate(db);
Post.associate(db);

module.exports = db;