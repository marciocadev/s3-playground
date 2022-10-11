import { S3Client, GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { text, json } from 'stream/consumers';

const client = new S3Client({
  region: 'us-east-1',
});

export const handler = async() => {
  try {
    const inputJson: GetObjectCommandInput = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'teste.json',
    };

    const resultJson = await client.send(new GetObjectCommand(inputJson));
    const dataJson = await json(resultJson.Body);
    console.log(dataJson);

    const inputTxt: GetObjectCommandInput = {
      Bucket: 'marcio-s3-playground',
      Key: 'teste.txt',
    };

    const resultTxt = await client.send(new GetObjectCommand(inputTxt));
    const dataTxt = await text(resultTxt.Body);
    console.log(dataTxt);
  } catch(err) {
    console.log(err);
  }
}