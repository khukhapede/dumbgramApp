"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class feeds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      feeds.belongsTo(models.users, {
        as: "creator",
        foreignKey: {
          name: "userId",
        },
      });
      feeds.hasMany(models.likes, {
        as: "postId",
        foreignKey: {
          name: "feedId",
        },
      });
      feeds.hasMany(models.comments, {
        as: "commentId",
        foreignKey: {
          name: "feedId",
        },
      });
    }
  }
  feeds.init(
    {
      filename: DataTypes.STRING,
      caption: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "feeds",
    }
  );
  return feeds;
};
