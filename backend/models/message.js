"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      message.belongsTo(models.users, {
        as: "sender",
        foreignKey: {
          name: "sourceId",
        },
      });
      message.belongsTo(models.users, {
        as: "receiver",
        foreignKey: {
          name: "targetId",
        },
      });
    }
  }
  message.init(
    {
      message: DataTypes.STRING,
      sourceId: DataTypes.INTEGER,
      targetId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "message",
    }
  );
  return message;
};
