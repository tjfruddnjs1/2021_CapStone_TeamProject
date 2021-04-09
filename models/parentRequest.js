const Sequelize = require('sequelize');

module.exports = class ParentRequest extends Sequelize.Model {
  static init(sequelize) {
    return super.init({      
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      gardenname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },      
      childName : {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
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
      modelName: 'ParnetRequest',
      tableName: 'parentrequests',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.ParentRequest.belongsTo(db.Garden, {foreignKey : 'gardencode', targetKey : 'gardencode'});
    db.ParentRequest.belongsTo(db.User, {foreignKey : 'userId', targetKey : 'id'});
  }
};