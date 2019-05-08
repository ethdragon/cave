describe('index test', () => {
    it('test place holder', () => {
        expect({ response: 'some status' }).toMatchInlineSnapshot(`
            Object {
              "response": "some status",
            }
        `);
    });
});
