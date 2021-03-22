const Sequelize = require('sequelize');

module.exports = class SggCode extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      sggname : {
        type: Sequelize.STRING(40),
        allowNull : false,                     
      },
      sggcode : {
        type : Sequelize.INTEGER(10),        
        primaryKey : true,
      },       
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'SggCode',
      tableName: 'sggcodes',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
      db.SggCode.belongsTo(db.SidoCode, {
          foreignKey : {
              name : 'sidocode',
              allowNull : false,              
          },
          targetKey : 'sidocode'    
      });
      
      db.SggCode.hasMany(db.Garden, {foreignKey : {name : 'sggcode', allowNull : false}, sourceKey : 'sggcode'});
  }
};