import { TeslaAuthUnexpired } from '../tesla';

describe('tesla runtime types', () => {
    const fakeNowInSeconds = 1557300000;
    beforeEach(() => {
        Date.now = jest.fn(() => fakeNowInSeconds * 1000); //  tslint:disable-line no-expression-statement
    });

    it('should fail to validate expired token', () => {
        const expiredToken = {
            access_token: 'abcdefg',
            token_type: 'bearer',
            expires_in: 3888000,
            refresh_token: 'opqrstuvwxyz',
            created_at: 1452010371,
        };
        const tokenEither = TeslaAuthUnexpired.decode(expiredToken);
        expect(tokenEither.isLeft()).toBeTruthy();
    });

    it('shoud fail to validate token expired within 300s', () => {
        const expiredInSeconds = 3888000;
        const secondsToExpired = 200;
        const toeknExpiresWithin300s = {
            access_token: 'abcdefg',
            token_type: 'bearer',
            expires_in: expiredInSeconds,
            refresh_token: 'opqrstuvwxyz',
            created_at: fakeNowInSeconds - expiredInSeconds + secondsToExpired,
        };
        const tokenEither = TeslaAuthUnexpired.decode(toeknExpiresWithin300s);
        expect(tokenEither.isLeft()).toBeTruthy();
    });

    it('should pass validation on good token', () => {
        const validToken = {
            access_token: 'abcdefg',
            token_type: 'bearer',
            expires_in: 3888000,
            refresh_token: 'opqrstuvwxyz',
            created_at: 1557288997,
        };
        const tokenEither = TeslaAuthUnexpired.decode(validToken);
        expect(tokenEither.value).toMatchInlineSnapshot(`
            Object {
              "access_token": "abcdefg",
              "created_at": 1557288997,
              "expires_in": 3888000,
              "refresh_token": "opqrstuvwxyz",
              "token_type": "bearer",
            }
        `);
    });
});
