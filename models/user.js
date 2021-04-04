const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      nickname : {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      email : {
        type : Sequelize.STRING(50),
        allowNull: true,
        unique: true,
      }, 
      password : {
        type: Sequelize.STRING(200),
        allowNull : true,
      },
      phone :{
        type : Sequelize.STRING(50),
        allowNull : true,
      },
      gender : {
        type : Sequelize.STRING(10),
        allowNull : true,
      },
      path : {
        type : Sequelize.STRING(100),
        allowNull: true,            
      }, 
      provider : {
        type : Sequelize.STRING(10),
        allowNull : false,
        defaultValue : 'local',
      },
      snsId:{
          type : Sequelize.STRING(30),
          allowNull : true,
      } 
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey : 'writer', sourceKey : 'id', onDelete: 'cascade'});
  }
};