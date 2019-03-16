import { getTeslaStatus } from '../index';

describe('index test', () => {
    it('test place holder', () => {
        expect(getTeslaStatus()).toMatchInlineSnapshot(`
Object {
  "response": "some status",
}
`);
    });
});
