import { SQS } from 'aws-sdk';

const sqs = new SQS();

export const putMessage = async (msgType: string, msg: object, queueUrl: string) => {
    const params = {
        MessageAttributes: {
            MessageType: {
                DataType: 'String',
                StringValue: msgType,
            },
            GeneratedTimestamp: {
                DataType: 'String',
                StringValue: `${new Date().valueOf()}`,
            },
        },
        MessageBody: JSON.stringify(msg),
        QueueUrl: queueUrl,
      };
    return await sqs.sendMessage(params).promise();
};

export const deleteMessages = async (msgs: SQS.DeleteMessageBatchRequestEntryList, queueUrl: string) => {
    const deleteMessageBatchRequest = {
        Entries: msgs,
        QueueUrl: queueUrl,
    };
    return await sqs.deleteMessageBatch(deleteMessageBatchRequest).promise();
};
