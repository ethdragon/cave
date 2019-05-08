import { tryCatch } from 'fp-ts/lib/TaskEither';
import { fetchTask } from '../fetch';

const mockJSON = jest.fn();

jest.mock('node-fetch', () => ({
    default: () =>
        Promise.resolve({
            json: mockJSON,
            status: 200,
        }),
}));

describe('fetchTask', () => {
    beforeEach(() => {
        mockJSON.mockReset();
    });

    it('fetches results', async () => {
        mockJSON.mockImplementation(() => Promise.resolve({ foo: 'bar' }));
        const fetchEither = await fetchTask('http://example.com/api/ip', 'GET')
            .chain(x => tryCatch(() => x.json(), err => err))
            .run();
        expect(fetchEither.value).toMatchInlineSnapshot(`
                        Object {
                          "foo": "bar",
                        }
                `);
    });

    it('return left when fetch json failed', async () => {
        mockJSON.mockImplementation(() => Promise.reject('Mock failed scenario'));
        const fetchEither = await fetchTask('http://example.com/api/ip', 'GET')
            .chain(x => tryCatch(() => x.json(), err => err))
            .run();
        expect(fetchEither.isLeft).toBeTruthy();
        expect(fetchEither).toMatchInlineSnapshot(`
            Left {
              "_tag": "Left",
              "value": "Mock failed scenario",
            }
        `);
    });
});
