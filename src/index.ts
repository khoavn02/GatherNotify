import AWS from "aws-sdk";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_ACCESS_KEY_ID;

const credentials = new AWS.Credentials({
  accessKeyId: AWS_ACCESS_KEY_ID as string,
  secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
});
const sns = new AWS.SNS({ credentials: credentials, region: AWS_REGION });

async function createTopicIfNotFound(topicName: string): Promise<string> {
  try {
    const data = await sns.listTopics().promise();
    const topic = data.Topics?.find((t) =>
      t.TopicArn?.endsWith(`:${topicName}`)
    );

    if (topic) {
      return topic.TopicArn!;
    } else {
      const createTopicResponse = await sns
        .createTopic({ Name: topicName })
        .promise();
      return createTopicResponse.TopicArn!;
    }
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
}

export async function notify(type: string, data: unknown) {
  const topic = await createTopicIfNotFound(type);
  const params = {
    Message: JSON.stringify(data),
    TopicArn: topic,
  };

  sns.publish(params, (err, data) => {
    if (err) {
      throw new Error(JSON.stringify(err));
    } else {
      console.log("Message sent:", data.MessageId);
    }
  });
}
