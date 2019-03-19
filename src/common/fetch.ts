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
