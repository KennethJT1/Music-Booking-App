const { Sequelize } = require("sequelize");
const dotenv = require("dotenv").config();
const logger = require("../utils/logger");

const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: config.dialectOptions,
  pool: {
    max: config.pool?.max || 5,
    min: config.pool?.min || 0,
    acquire: config.pool?.acquire || 60000,
    idle: config.pool?.idle || 10000,
  },
});

sequelize
  .authenticate()
  .then(() => logger.info("✅ Database connection established successfully"))
  .catch((err) => logger.error("❌ Unable to connect to database:", err));

module.exports = sequelize;