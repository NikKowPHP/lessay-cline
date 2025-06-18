import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  base: {
    reqId: uuidv4(), // Add request ID correlation
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  messageKey: 'message',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  } : undefined
});

export default logger;