const Sequelize = require('sequelize');

module.exports = class Garden extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      gardencode : {
        type: Sequelize.STRING(100),
        primaryKey : true,                             
      },
      category : {
        type: Sequelize.STRING(10),
        allowNull : false,
      },       
      type : {
        type: Sequelize.STRING(10),
        allowNull : false,
      },       
      name : {
        type: Sequelize.STRING(50),
        allowNull : false,
      },       
      phone : {
        type: Sequelize.STRING(50),
        allowNull : false,
      },       
      address : {
        type: Sequelize.STRING(255),
        allowNull : false,
      },
      homepage : {
        type: Sequelize.STRING(255),
        allowNull : true,
      },
      sggcode : {
        type: Sequelize.INTEGER(10),
        allowNull : false,
      },         
      cctvnum : {
        type: Sequelize.STRING(50),
        allowNull : true,
      },     
      isbus : {
        type: Sequelize.STRING(50),
        allowNull : true,
      },     
      latitude : {
        type : Sequelize.DECIMAL(25,20),        
        allowNull : true,
      },                
      longitude : {
        type : Sequelize.DECIMAL(25,20),                
        allowNull : true,
      },       
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Garden',
      tableName: 'gardens',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {    
  }
};