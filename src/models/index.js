"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

const sequelize = require("../config");

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const modelFunction = require(path.join(__dirname, file));

    if (typeof modelFunction !== "function") {
      console.error(`Error: ${file} does not export a function`);
      return;
    }

    const model = modelFunction(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Define a function for running transactions
const runTransaction = async (callback) => {
  const transaction = await sequelize.transaction();
  try {
    await callback(transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Wrap your associations in a function that uses transactions
const associateModels = async () => {
  await runTransaction(async (transaction) => {
    db.Artist.hasMany(db.Event, { foreignKey: "artistId" });
    db.Event.belongsTo(db.Artist, { foreignKey: "artistId" });
    db.Event.hasMany(db.Booking, { foreignKey: "bookingId" });
    db.Booking.belongsTo(db.Event, { foreignKey: "eventId" });
  });
};

associateModels();

module.exports = db;
