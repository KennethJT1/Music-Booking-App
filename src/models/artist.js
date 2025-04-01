const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const Artist = sequelize.define(
    "Artist",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      socialLinks: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "Artist",
      timestamps: true,
    }
  );

  Artist.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  Artist.addHook("beforeCreate", async (artist) => {
    const existingArtist = await Artist.findOne({
      where: { email: artist.email },
    });
    if (existingArtist) {
      throw new Error("Email already registered.");
    }

    if (artist.changed("password")) {
      artist.password = await bcrypt.hash(artist.password, 10);
    }
  });

  Artist.addHook("beforeUpdate", async (artist) => {
    if (artist.changed("password")) {
      artist.password = await bcrypt.hash(artist.password, 10);
    }
  });

  Artist.associate = (models) => {
    Artist.hasMany(models.Event, { foreignKey: "artistId" });
  };

  return Artist;
};
