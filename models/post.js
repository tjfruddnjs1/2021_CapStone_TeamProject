const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      body : {
        type: Sequelize.STRING(3000),
        allowNull: false,
      },
      createdAt : {
        type: Sequelize.DATE,
        defaultValue : Sequelize.NOW,
      },
      updatedAt : {
        type : Sequelize.DATE,
        allowNull : true,
      },
      hits : {
        type : Sequelize.INTEGER,
        defaultValue : '0',
      },
      }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User, {foreignKey : 'writer', targetKey : 'id'});
    db.Post.hasMany(db.Comment, { foreignKey : 'post', sourceKey : 'id'});
  }
};