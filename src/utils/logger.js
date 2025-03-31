const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, colorize } = format;
const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message} -- ${timestamp}`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), consoleLogFormat),
    }),
    new transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
    }),

    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
  ],
});

module.exports = logger;
