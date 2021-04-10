const Sequelize = require('sequelize');

module.exports = class Request extends Sequelize.Model {
  static init(sequelize) {
    return super.init({      
      gardentype: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },      
      requesttype: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },           
      representative : {
        type: Sequelize.STRING(50),
        allowNull: true,
      },      
      gardenphone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },   
      childName : {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      isapprove: {
        type: Sequelize.BOOLEAN(50),
        allowNull: false,
        defaultValue : false,
      },      
      createdAt : {
        type: Sequelize.DATE,
        defaultValue : Sequelize.NOW,
      },     
      completedAt : {
        type: Sequelize.DATE,
        allowNull : true,
      },       
      }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Request',
      tableName: 'requests',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Request.belongsTo(db.Garden, {foreignKey : 'gardencode', source : 'gardencode'});
    db.Request.belongsTo(db.User, {foreignKey : 'userId', targetKey : 'id'});
  }
};