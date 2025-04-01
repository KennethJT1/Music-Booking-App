'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'amount' column to the 'Event' table
    await queryInterface.addColumn('Event', 'amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0, // Optional: Set a default value to avoid issues with existing rows
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'amount' column if rolling back
    await queryInterface.removeColumn('Event', 'amount');
  },
};