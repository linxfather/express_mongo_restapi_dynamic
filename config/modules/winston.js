import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export function createLogger(name, debugMode, console = false) {
  const { format, createLogger, transports } = winston;
  const logPath = `logs/${name}`;
  const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    //format.errors({ stack: true }),
    format.printf(({ level, message, timestamp }) => {
     return `${timestamp} [${level}]: ${message}`;
    })
  );
  return winston.createLogger({
    level: debugMode ? 'debug' : 'info',
    format: logFormat, 
    transports: [
      ...((console && debugMode) ? [new transports.Console()] : []),
      new DailyRotateFile({
        filename: `${logPath}/%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
      })
    ]
  });
}