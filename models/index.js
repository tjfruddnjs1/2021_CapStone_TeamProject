const Sequelize = require("sequelize");
const User = require('./user');
const Drop = require('./drop');

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

User.init(sequelize);
Drop.init(sequelize);

User.associate(db);
Drop.associate(db);

module.exports = db;