module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Booking", "currency", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Booking", "currency");
  }
};
