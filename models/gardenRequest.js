const Sequelize = require('sequelize');

module.exports = class GardenRequest extends Sequelize.Model {
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
      writer: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      representative : {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      gardenphone: {
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
      }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'GardenRequest',
      tableName: 'gardenrequests',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.GardenRequest.belongsTo(db.Garden, {foreignKey : 'gardencode', source : 'gardencode'});
  }
};