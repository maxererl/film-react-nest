import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
    jest.spyOn(console, 'log');
  });

  afterEach(() => {
    (console.log as jest.MockedFunction<typeof console.log>).mockRestore();
  });

  describe('Log levels', () => {
    it('.log() should pass correct log level string to console.log', () => {
      logger.log('');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^level=log/),
      );
    });

    it('.warn() should pass correct log level string to console.warn', () => {
      logger.warn('');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^level=warn/),
      );
    });

    it('.error() should pass correct log level string to console.error', () => {
      logger.error('');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^level=error/),
      );
    });
  });

  describe('Log format', () => {
    it('Empty message and optionals', () => {
      logger.log('');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^level=log\tmessage=$/),
      );
    });

    it('With string message', () => {
      const message = 'something';
      logger.log(message);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`^level=log\tmessage=${message}$`)),
      );
    });

    it('With numeric message', () => {
      const message = 3.14;
      logger.log(message);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`^level=log\tmessage=${message}$`)),
      );
    });

    it('With object message', () => {
      const message = { some: 'something' };
      logger.log(message);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(
            `^level=log\tmessage=${Object.keys(message)
              .map((key) => `${key}=${message[key]}`)
              .join('\t')}$`,
          ),
        ),
      );
    });

    it('With one optional', () => {
      const optional = 'something';
      logger.log('', optional);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`^level=log\tmessage=\toptionalParams=\\[${optional}\\]$`),
        ),
      );
    });

    it('With many optionals', () => {
      const optionals = ['something', 'more', 'etc'];
      logger.log('', ...optionals);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(
            `^level=log\tmessage=\toptionalParams=\\[${optionals}\\]$`,
          ),
        ),
      );
    });

    it('With single nested optional', () => {
      const optionals = [['something']];
      logger.log('', ...optionals);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(
            `^level=log\tmessage=\toptionalParams=\\[\\[${optionals}\\]\\]$`,
          ),
        ),
      );
    });

    it('With single object optional', () => {
      const optional = { some: 'something' };
      logger.log('', optional);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(
            `^level=log\tmessage=\toptionalParams=\\[${Object.keys(optional)
              .map((key) => `${key}=${optional[key]}`)
              .join('\t')}\\]$`,
          ),
        ),
      );
    });

    it('With message and optional', () => {
      const message = 'someMessage';
      const optional = 'something';
      logger.log(message, optional);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(
            `^level=log\tmessage=${message}\toptionalParams=\\[${optional}\\]$`,
          ),
        ),
      );
    });
  });
});
