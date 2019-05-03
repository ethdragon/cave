import { S3 } from 'aws-sdk';

const s3 = new S3();

const getObjectFromS3Promise = (bucket: string, key: string) => {
    return s3.getObject({
        Bucket: bucket,
        Key: key,
    }).promise();
};

export const getObjectFromS3AsBuffer = async (bucket: string, key: string) => {
    const bodyBuffer = await getObjectFromS3Promise(bucket, key);
    return bodyBuffer.Body as Buffer;
};

export const getObjectFromS3AsString = async (bucket: string, key: string) => {
    const bodyBuffer = await getObjectFromS3AsBuffer(bucket, key);
    return bodyBuffer.toString('utf-8');
};

export const putObjectToS3 = (bucket: string, key: string, content: string | Buffer) => {
    const putObjParams = {
        Bucket: bucket,
        Key: key,
        Body: content,
        ACL: 'bucket-owner-full-control',
        ServerSideEncryption: 'AES256',
    };
    return s3.putObject(putObjParams).promise();
};
