import * as t from 'io-ts';
import { typedFetcher } from '../fetch';

jest.mock(
    'node-fetch',
    () =>
        ({
            default: () => ({
                json: () => ({ foo: 'bar' }),
                status: 200,
            }),
        } as any),
);

describe('fetch', () => {
    it('success with expect shape', async () => {
        const type = t.type({ foo: t.string }, 'foo');
        const res = await typedFetcher(type)('http://worldtimeapi.org/api/ip', 'GET');
        expect(res).toMatchInlineSnapshot(`
Object {
  "response": Right {
    "_tag": "Right",
    "value": Object {
      "foo": "bar",
    },
  },
  "status": 200,
}
`);
    });

    it('success with unexpect shape', async () => {
        const type = t.type({ notfoo: t.string }, 'notfoo');
        const res = await typedFetcher(type)('http://worldtimeapi.org/api/ip', 'GET');
        expect(res).toMatchInlineSnapshot(`
Object {
  "response": Left {
    "_tag": "Left",
    "value": Array [
      Object {
        "context": Array [
          Object {
            "actual": Object {
              "foo": "bar",
            },
            "key": "",
            "type": InterfaceType {
              "_tag": "InterfaceType",
              "encode": [Function],
              "is": [Function],
              "name": "notfoo",
              "props": Object {
                "notfoo": StringType {
                  "_tag": "StringType",
                  "encode": [Function],
                  "is": [Function],
                  "name": "string",
                  "validate": [Function],
                },
              },
              "validate": [Function],
            },
          },
          Object {
            "actual": undefined,
            "key": "notfoo",
            "type": StringType {
              "_tag": "StringType",
              "encode": [Function],
              "is": [Function],
              "name": "string",
              "validate": [Function],
            },
          },
        ],
        "message": undefined,
        "value": undefined,
      },
    ],
  },
  "status": 200,
}
`);
    });
});
