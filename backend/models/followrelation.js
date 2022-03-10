"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class followRelation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      followRelation.belongsTo(models.users, {
        as: "sourceUser",
        foreignKey: {
          name: "sourceId",
        },
      });
      followRelation.belongsTo(models.users, {
        as: "targetUser",
        foreignKey: {
          name: "targetId",
        },
      });
    }
  }
  followRelation.init(
    {
      sourceId: DataTypes.INTEGER,
      targetId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "followRelation",
    }
  );
  return followRelation;
};
