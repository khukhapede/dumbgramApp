"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comments.belongsTo(models.users, {
        as: "commentator",
        foreignKey: {
          name: "userId",
        },
      });
      comments.belongsTo(models.feeds, {
        as: "commmentId",
        foreignKey: {
          name: "feedId",
        },
      });
    }
  }
  comments.init(
    {
      comment: DataTypes.STRING,
      feedId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "comments",
    }
  );
  return comments;
};
