const Sequelize = require('sequelize');

module.exports = class SidoCode extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      sidoname : {
        type: Sequelize.STRING(40),
        allowNull : false,                       
      },
      sidocode : {
        type : Sequelize.INTEGER(10),        
        primaryKey : true,
      },       
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'SidoCode',
      tableName: 'sidocodes',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
      db.SidoCode.hasMany(db.SggCode, {foreignKey : {name : 'sidocode', allowNull : false}, sourceKey : 'sidocode'});
  }
};