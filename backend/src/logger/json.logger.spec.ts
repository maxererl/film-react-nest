import { JsonLogger } from './json.logger';

describe('JSONLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
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
        expect.stringMatching(/^{"level":"log"/),
      );
    });

    it('.warn() should pass correct log level string to console.warn', () => {
      logger.warn('');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^{"level":"warn"/),
      );
    });

    it('.error() should pass correct log level string to console.error', () => {
      logger.error('');
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^{"level":"error"/),
      );
    });
  });

  describe('Log format', () => {
    it('Empty message and optionals', () => {
      logger.log('');
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify({ level: 'log', message: '', optionalParams: [] }),
      );
    });

    it('With string message', () => {
      const message = 'something';
      logger.log(message);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify({ level: 'log', message, optionalParams: [] }),
      );
    });

    it('With numeric message', () => {
      const message = 3.14;
      logger.log(message);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify({ level: 'log', message, optionalParams: [] }),
      );
    });

    it('With object message', () => {
      const message = { some: 'something' };
      logger.log(message);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify({ level: 'log', message, optionalParams: [] }),
      );
    });

    it('With one optional', () => {
      const optional = 'something';
      logger.log('', optional);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: '',
          optionalParams: [optional],
        }),
      );
    });

    it('With message and optional', () => {
      const message = 'someMessage';
      const optional = 'something';
      logger.log(message, optional);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message,
          optionalParams: [optional],
        }),
      );
    });
  });
});
