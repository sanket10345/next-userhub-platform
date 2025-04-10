const fs = require('fs');
const path = require('path');
const { createLogger, transports, format } = require('winston');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'app.log') }),
    new transports.Console(), // optional: logs to terminal too
  ],
});

module.exports = logger;
