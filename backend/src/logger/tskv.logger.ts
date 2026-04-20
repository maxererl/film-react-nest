import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private anyToTskv(object: any): string {
    if (Array.isArray(object)) {
      return `[${object.map((nestObj) => this.anyToTskv(nestObj)).join(',')}]`;
    }
    if (typeof object === 'object') {
      return Object.keys(object)
        .map((key) => `${key}=${this.anyToTskv(object[key])}`)
        .join('\t');
    }
    return String(object);
  }

  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    return (
      `level=${level}\tmessage=${this.anyToTskv(message)}` +
      (String(optionalParams)
        ? `\toptionalParams=[${optionalParams.map((optionalParam) => this.anyToTskv(optionalParam)).join()}]`
        : '')
    );
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('warn', message, ...optionalParams));
  }

  /**
   * Write a 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('error', message, ...optionalParams));
  }
}
