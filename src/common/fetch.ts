import { tryCatch } from 'fp-ts/lib/TaskEither';
import fetch from 'node-fetch';

export type AllowedHTTPMethods = 'GET' | 'POST';

export const fetchTask = (url: string,  method: AllowedHTTPMethods, body?: string, token?: string) => {
    const authHeader = token ? { Authorization: token } : null;
    return tryCatch(
        () => fetch(url, {
            method,
            headers: {
                ...authHeader,
                'Content-Type': 'application/json',
            },
            ...{ body },
        }),
        err => err,
    );
};
