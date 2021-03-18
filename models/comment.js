const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      text: {
        type: Sequelize.STRING(50),
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
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
      db.Comment.belongsTo(db.Post, {foreignKey : 'post', targetKey : 'id'});
  }
};