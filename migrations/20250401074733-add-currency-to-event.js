"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Event", "currency", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "NGN", // Set a default value
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Event", "currency");
  },
};
