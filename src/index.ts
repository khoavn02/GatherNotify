import * as dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

function checkIfTopicExists(AWS: any, topicName: string) {
  return new Promise((resolve, reject) => {
    try {
      const listTopics = new AWS.SNS({ apiVersion: "2010-03-31" })
        .listTopics({})
        .promise();
      listTopics
        .then((data: any) => {
          if (data.Topics.includes(topicName)) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err: any) => {
          throw err;
        });
    } catch (e) {
      reject(e);
    }
  });
}

function createTopic(AWS: any, topicName: string) {
  return new Promise((resolve, reject) => {
    try {
      const createTopic = new AWS.SNS({ apiVersion: "2010-03-31" })
        .createTopic({
          Name: topicName,
        })
        .promise();
      createTopic
        .then((data: any) => {
          console.log(`Created Topic - ${topicName}`);
          console.log("data", data);
          resolve(data.TopicArn);
        })
        .catch((err: any) => {
          throw err;
        });
    } catch (e) {
      reject(e);
    }
  });
}

export async function notify(type: string, data: unknown) {
  const ifTopicExists = await checkIfTopicExists(AWS, "ON_POST_CREATED");

  if (!ifTopicExists) {
    await createTopic(AWS, "ON_POST_CREATED");
  }
}

notify("cat", "meo meo");
