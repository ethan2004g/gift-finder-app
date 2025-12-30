type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: LogLevel, message: string, metadata?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const entry: LogEntry = {
      level,
      message,
      timestamp,
      ...(metadata && { metadata }),
    };

    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    if (!this.shouldLog(level)) return;

    const formatted = this.formatMessage(level, message, metadata);
    
    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'debug':
        console.debug(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log('error', message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log('debug', message, metadata);
  }
}

export const logger = new Logger();

