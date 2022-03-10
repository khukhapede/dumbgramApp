"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.followRelation, {
        as: "sourceUser",
        foreignKey: {
          name: "sourceId",
        },
      });
      users.hasMany(models.followRelation, {
        as: "targetUser",
        foreignKey: {
          name: "targetId",
        },
      });
      users.hasMany(models.message, {
        as: "sender",
        foreignKey: {
          name: "sourceId",
        },
      });
      users.hasMany(models.message, {
        as: "receiver",
        foreignKey: {
          name: "targetId",
        },
      });
      users.hasMany(models.feeds, {
        as: "creator",
        foreignKey: {
          name: "userId",
        },
      });
      users.hasMany(models.likes, {
        as: "likes",
        foreignKey: {
          name: "userId",
        },
      });
      users.hasMany(models.comments, {
        as: "commentator",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  users.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      fullname: DataTypes.STRING,
      bio: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
