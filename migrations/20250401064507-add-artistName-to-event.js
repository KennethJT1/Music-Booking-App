'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add the column as nullable
    await queryInterface.addColumn('Event', 'artistName', {
      type: Sequelize.STRING,
      allowNull: true, // Initially allow null values
    });

    // Step 2: Populate the column with default values (if needed)
    await queryInterface.sequelize.query(
      'UPDATE "Event" SET "artistName" = \'Unknown Artist\' WHERE "artistName" IS NULL;'
    );

    // Step 3: Alter the column to enforce NOT NULL
    await queryInterface.changeColumn('Event', 'artistName', {
      type: Sequelize.STRING,
      allowNull: false, // Now enforce NOT NULL
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the column if rolling back
    await queryInterface.removeColumn('Event', 'artistName');
  },
};