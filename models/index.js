const Sequelize = require("sequelize");
const User = require('./user');
const Drop = require('./drop');

const Post = require('./post');
const Comment = require('./comment');

const SggCode = require('./sggcode');
const SidoCode = require('./sidocode');
const Garden = require('./garden');


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

db.SidoCode = SidoCode;
db.SggCode = SggCode;

User.init(sequelize);
Drop.init(sequelize);
SidoCode.init(sequelize);
SggCode.init(sequelize);
Garden.init(sequelize);

User.associate(db);
Drop.associate(db);
SidoCode.associate(db);
SggCode.associate(db);
Garden.associate(db);


module.exports = db;