const Sequelize = require('sequelize');

module.exports = class Garden extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      gardencode : {
        type: Sequelize.STRING(100),
        primaryKey : true,                             
      },
      gardencategory : {
        type: Sequelize.STRING(10),
        allowNull : false,
      },       
      gardentype : {
        type: Sequelize.STRING(10),
        allowNull : false,
      },       
      gardenname : {
        type: Sequelize.STRING(50),
        allowNull : false,
      },       
      gardentel : {
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
    db.Garden.belongsTo(db.SggCode, {
      foreignKey : {
          name : 'sggcode',          
          allowNull : false,                    
      },
      targetKey : 'sggcode',            
    });

    db.Garden.hasMany(db.Review,{
      foreignKey : 'gardencode',
      sourceKey : 'gardencode'
    });

    db.Garden.hasMany(db.Request, {foreignKey : 'gardencode', source : 'gardencode'});        
    db.Garden.hasOne(db.Domain, {foreignKey : 'gardencode', source : 'gardencode'});    
  }
};