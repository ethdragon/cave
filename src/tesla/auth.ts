import { Task } from 'fp-ts/lib/Task';
import { taskEither, tryCatch } from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import fetch from 'node-fetch';
import { getObjectFromS3AsString, putObjectToS3 } from '../common/s3';

/**
 * Get secretes from secrete S3 bucket (which has audit turned on)
 * TODO: add a context to the function to reuse in other applications.
 * @param type use 'auth_token' or 'credential'
 */
const getSecrete = async (type: 'auth_token' | 'credential') =>
    await getObjectFromS3AsString(
        'cave-automation-secretes',
        `yang/tesla/${type}.json`,
    );

const putSecrete = async (secrete: string) =>
    await putObjectToS3(
        'cave-automation-secretes',
        `yang/tesla/auth_token.json`,
        secrete,
    );

const authTokenFromS3Task = tryCatch(
    () => getSecrete('auth_token'),
    err => err,
);

const credentialFromS3Task = tryCatch(
    () => getSecrete('credential'),
    err => err,
);

export const fetchTask = (url: string,  method: 'GET'|'POST', body?: string) => tryCatch(
    () => fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...{ body },
    }),
    err => err,
);

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
type TeslaAuthUnexpired = typeof TeslaAuthUnexpired._A;

const TeslaCredential = t.interface({
    email: t.string,
    password: t.string,
});

const getStoredCredentialTask = () => {
    return credentialFromS3Task
        .map(x => JSON.parse(x))
        .chain(x => taskEither.fromEither(TeslaCredential.decode(x)));
};

export const getStoredAuthTokenTask = () => {
    return authTokenFromS3Task
        .map(x => JSON.parse(x))
        .chain(x => taskEither.fromEither(TeslaAuthUnexpired.decode(x)));
};

/**
 * Authenticate with Tesla and get a new token
 * TODO: use environment variable for url for future integration tests
 */
export const getNewAuthTokenTask = () => {
    const authBaseParams = {
        grant_type: 'password',
        client_id: '81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384',
        client_secret: 'c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3',
    };
    return getStoredCredentialTask()
        .map(cred => ({ ...authBaseParams, ...cred }))
        .map(authParams => JSON.stringify(authParams))
        .chain(authParamString => fetchTask(
            'https://owner-api.teslamotors.com/oauth/token',
            'POST',
            authParamString))
        .chain(x => tryCatch(() => x.json(), err => err))
        .chain(x => taskEither.fromEither(TeslaAuthUnexpired.decode(x)))
        .chain(x => taskEither.fromTask(new Task(async () => {
            try { // TODO: this is kind of hacky
                void await putSecrete(JSON.stringify(x));
            } catch (e) {
                const errMsg = {
                    seo: ['FailedToSaveToS3', 'TeslaAuth', 'getNewAuthTokenTask'],
                    fullError: JSON.stringify(e),
                };
                console.error(errMsg);
            }
            return Promise.resolve(x);
        })));
};

/**
 * Try to save the auth token to S3 but ignore any errors during the process
 * @param authToken an unexpired Tesla auth token object
 */
export const saveAuthTokenTask = (authToken: TeslaAuthUnexpired) => {
    const saveAuthToken = async () => {
        try {
            void await putSecrete(JSON.stringify(authToken));
        } catch (e) {
            const errMsg = {
                seo: ['FailedToSaveToS3', 'TeslaAuth', 'getNewAuthTokenTask'],
                fullError: JSON.stringify(e),
            };
            console.error(errMsg);
        }
        return Promise.resolve(authToken);
    };
    return taskEither.fromTask(new Task(saveAuthToken));
};
