import * as t from 'io-ts';

// todo: can be moved out of sqs
export const NumberFromString = new t.Type<number, string, unknown>(
    'NumberFromString',
    t.number.is,
    (u, c) =>
      t.string.validate(u, c).chain(s => {
        const n = +s;
        return isNaN(n) ? t.failure(u, c, 'cannot parse to a number') : t.success(n);
      }),
    String,
  );

export const SQSMessage = t.interface({
    messageId: t.string,
    receiptHandle: t.string,
    body: t.string,
    attributes: t.interface({
        ApproximateReceiveCount: NumberFromString,
        SentTimestamp: NumberFromString,
        SenderId: t.string,
        ApproximateFirstReceiveTimestamp: NumberFromString,
    }),
    messageAttributes: t.object,
    md5OfBody: t.string,
    eventSource: t.literal('aws:sqs'),
    eventSourceARN: t.string,
    awsRegion: t.string,
});
