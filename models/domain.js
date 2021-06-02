const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      ip: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },      
      port : {
        type : Sequelize.STRING(40),
        allowNull : false,
      }
      }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Domain',
      tableName: 'domains',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
      db.Domain.belongsTo(db.Garden, {foreignKey : 'gardencode', targetKey : 'gardencode', onDelete: 'cascade'});
  }
};