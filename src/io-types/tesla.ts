import * as t from 'io-ts';

const TeslaAuth = t.interface({
    access_token: t.string,
    token_type: t.literal('bearer'),
    expires_in: t.number,
    refresh_token: t.string,
    created_at: t.number,
}, 'TeslaAuthToken');
type TeslaAuth = typeof TeslaAuth._A;

const hasTokenExpired = (token: TeslaAuth) => {
    const bufferTimeInSeconds = 300;
    const expiredAtTimestamp = token.created_at + token.expires_in - bufferTimeInSeconds;
    return Math.floor(Date.now() / 1000) < expiredAtTimestamp;
};

interface ITeslaAuthUnexpired {
    readonly UnexpiredToken: symbol;
}

// validate if token will expire in 5 minutes
export const TeslaAuthUnexpired = t.brand(
    TeslaAuth,
    (n): n is t.Branded<TeslaAuth, ITeslaAuthUnexpired> => hasTokenExpired(n),
    'UnexpiredToken',
);
export type TeslaAuthUnexpired = typeof TeslaAuthUnexpired._A;

export const TeslaCredential = t.interface({
    email: t.string,
    password: t.string,
});
