import { tryCatch } from 'fp-ts/lib/TaskEither';
import * as t from 'io-ts';
import fetch from 'node-fetch';

export type AllowedHTTPMethods = 'GET' | 'POST';

export const typedFetcher = <A>(outType: t.Type<A>) =>
    async (url: string, method: AllowedHTTPMethods, token?: string) => {
        const authHeader = token ? { Authorization: token } : null;
        const headers = { ...authHeader };
        const res = await fetch(url, { headers, method });
        return {
            status: res.status,
            response: outType.decode(await res.json()),
        };
};

export const fetchTask = (url: string,  method: 'GET'|'POST', body?: string, token?: string) => {
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
