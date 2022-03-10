"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("users", "image", {
      type: Sequelize.STRING,
      defaultValue: "profil-baru.png",
      after: "bio"
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("users", "image");
  },
};
