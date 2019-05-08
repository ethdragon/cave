import { getNewAuthTokenTask, getStoredAuthTokenTask } from '../auth';

describe('', () => {
    it.skip('', async () => {
        const tokenEither = await getStoredAuthTokenTask().run();
        expect(tokenEither).toMatchInlineSnapshot();
    });

    it.skip('', async () => {
        const tokenEither = await getStoredAuthTokenTask()
            .orElse(getNewAuthTokenTask)
            .run();
        expect(tokenEither).toMatchInlineSnapshot();
    });
});
