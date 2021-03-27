const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      teacherName: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      attendTime : {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      reJoin : {
        type: Sequelize.STRING(10),
        allowNull : false,
      },
      isCommunicate :{
        type: Sequelize.STRING(10),
        allowNull : false,
      },
      isActive :{
        type: Sequelize.STRING(10),
        allowNull : false,
      },  
      isSafe :{
        type: Sequelize.STRING(10),
        allowNull : false,
      },
      advantage :{
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      disAdvantage : {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      createdAt : {
        type: Sequelize.DATE,
        defaultValue : Sequelize.NOW,
      },
      userNickname : {
        type : Sequelize.STRING(40),
        allowNull : false,
      }
      }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Review',
      tableName: 'reviews',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
      db.Review.belongsTo(db.Garden, {foreignKey : 'gardencode', targetKey : 'gardencode'});
  }
};