import { Sentry } from './sentry';

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

const CURRENT_LOG_LEVEL =
  process.env.NODE_ENV === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  },
};

/** Error 객체가 있으면 예외(스택 포함)로, 없으면 메시지 이벤트로 보고 */
function reportToSentry(message: string, args: unknown[]) {
  const error = args.find((arg): arg is Error => arg instanceof Error);
  const extra = { args: args.filter((arg) => arg !== error) };
  if (error) {
    Sentry.captureException(error, { extra: { message, ...extra } });
  } else {
    Sentry.captureMessage(message, { level: 'error', extra });
  }
}

class Logger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  private static print(
    level: LogLevel,
    message: string,
    args: unknown[],
    options: { color: string; label: string },
  ) {
    if (CURRENT_LOG_LEVEL <= level) {
      const timestamp = this.getTimestamp();
      const prefix = `${COLORS.fg.gray}[${timestamp}]${COLORS.reset}`;
      const label = `${options.color}[${options.label}]${COLORS.reset}`;

      const content = [prefix, label, message, ...args];

      switch (level) {
        case LOG_LEVELS.DEBUG:
          console.debug(...content);
          break;
        case LOG_LEVELS.INFO:
          console.info(...content);
          break;
        case LOG_LEVELS.WARN:
          console.warn(...content);
          break;
        case LOG_LEVELS.ERROR:
          console.error(...content);
          break;
      }
    }
  }

  static debug(message: string, ...args: unknown[]) {
    this.print(LOG_LEVELS.DEBUG, message, args, {
      color: COLORS.fg.magenta,
      label: 'DEBUG',
    });
  }

  static info(message: string, ...args: unknown[]) {
    this.print(LOG_LEVELS.INFO, message, args, {
      color: COLORS.fg.blue,
      label: 'INFO',
    });
  }

  static warn(message: string, ...args: unknown[]) {
    // 경고는 이벤트로 보내지 않고 이후 에러의 맥락(breadcrumb)으로만 남김
    Sentry.addBreadcrumb({ level: 'warning', message, data: args.length ? { args } : undefined });
    this.print(LOG_LEVELS.WARN, message, args, {
      color: COLORS.fg.yellow,
      label: 'WARN',
    });
  }

  static error(message: string, ...args: unknown[]) {
    reportToSentry(message, args);
    this.print(LOG_LEVELS.ERROR, message, args, {
      color: COLORS.fg.red,
      label: 'ERROR',
    });
  }
}

export default Logger;
