// ROO-AUDIT-TAG :: audit_remediation_phase_1.md :: Implement centralized logging utility
import pino from 'pino';
import type { Level } from 'pino';

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: {
    level: (label: Level) => ({ level: label.toUpperCase() }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  redact: {
    paths: ['password', '*.password', '*.secret'],
    censor: '[REDACTED]'
  }
});

// Add request ID tracking
export const childLogger = (requestId: string) => {
  return logger.child({ requestId });
};

export default logger;
// ROO-AUDIT-TAG :: audit_remediation_phase_1.md :: END