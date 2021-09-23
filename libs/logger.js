import appRoot from 'app-root-path';
import winston from 'winston';

const { format } = winston;

const { combine, timestamp, label, printf } = format;

const myFormat = printf((info) => {
  return `${info.timestamp} [${process.env.APP_NAME}] ${info.message}`;
});

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5mb
    maxFiles: 5,
    colorrize: true
  },
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorrize: true
  }
};

const logger = winston.createLogger({
  format: combine(
    label({
      label: 'info'
    }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
});

logger.stream = {
  write(message, encoding) {
    logger.info(message);
  }
};

export default logger;
