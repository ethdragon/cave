import { PathReporter } from 'io-ts/lib/PathReporter';
import { NumberFromString, SQSMessage } from '../sqs';

describe('NumberFromString', () => {
    it('should valid a number in a string format', () => {
        const numberEither = NumberFromString.decode('123454321');
        expect(numberEither.value).toMatchInlineSnapshot(`123454321`);
    });

    it('should report error on non parsable string', () => {
        const numberEither = NumberFromString.decode('123abc321');
        expect(PathReporter.report(numberEither)).toMatchInlineSnapshot(`
            Array [
              "cannot parse to a number",
            ]
        `);
    });
});

describe('SQS Message', () => {
    const sampleSQSMessage = {
        messageId: '059f36b4-87a3-44ab-83d2-661975830a7d',
        receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
        body: 'test',
        attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '1545082649183',
            SenderId: 'AIDAIENQZJOLO23YVJ4VO',
            ApproximateFirstReceiveTimestamp: '1545082649185',
        },
        messageAttributes: {},
        md5OfBody: '098f6bcd4621d373cade4e832627b4f6',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
        awsRegion: 'us-east-2',
    };

    it('should valiate sqs messages', () => {
        const msgEither = SQSMessage.decode(sampleSQSMessage);
        expect(msgEither.isRight).toBeTruthy();
    });

    it('should convert numeric string to number', () => {
        const msgEither = SQSMessage.decode(sampleSQSMessage);
        expect(msgEither.value).toMatchInlineSnapshot(`
                        Object {
                          "attributes": Object {
                            "ApproximateFirstReceiveTimestamp": 1545082649185,
                            "ApproximateReceiveCount": 1,
                            "SenderId": "AIDAIENQZJOLO23YVJ4VO",
                            "SentTimestamp": 1545082649183,
                          },
                          "awsRegion": "us-east-2",
                          "body": "test",
                          "eventSource": "aws:sqs",
                          "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:my-queue",
                          "md5OfBody": "098f6bcd4621d373cade4e832627b4f6",
                          "messageAttributes": Object {},
                          "messageId": "059f36b4-87a3-44ab-83d2-661975830a7d",
                          "receiptHandle": "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
                        }
                `);
    });
});
