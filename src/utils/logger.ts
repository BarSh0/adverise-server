import winston, { format, transports } from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    success: 3,
    debug: 4,
  },
  format: format.combine(
    // make all levels in uppercase
    format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })(),
    format.prettyPrint(),
    format.colorize(),
    format.printf((info) => `${info.level}: ${info.message}`)
  ),
  transports: [new transports.Console()],
});

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.simple(),
//     })
//   );
// }

export default logger;
