const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      artistId: {
        type: DataTypes.UUID,
        references: {
          model: "Artist",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "Event",
      timestamps: true,
    }
  );

  Event.associate = (models) => {
    Event.belongsTo(models.Artist, { foreignKey: "artistId" });
    Event.hasMany(models.Booking, { foreignKey: "bookingId" });
  };

  return Event;
};
