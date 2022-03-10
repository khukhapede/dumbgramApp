"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      likes.belongsTo(models.users, {
        as: "likes",
        foreignKey: {
          name: "userId",
        },
      });
      likes.belongsTo(models.feeds, {
        as: "postId",
        foreignKey: {
          name: "feedId",
        },
      });
    }
  }
  likes.init(
    {
      feedId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "likes",
    }
  );
  return likes;
};
