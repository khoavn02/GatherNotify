import dotenv from 'dotenv';
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

const sns = new AWS.SNS({apiVersion: "2010-03-31"});

/**
 * Checks if an SNS topic with the specified name exists and returns its Amazon Resource Name (ARN).
 @param topicName The name of the SNS topic to be checked.
 @returns A promise that resolves with the ARN of the SNS topic if it exists, or null if it doesn't.
 @throws If the topic name is invalid or the list of topics fails.
 */
const checkIfTopicExists = async (
    topicName: string
): Promise<string | null> => {
    if (!topicName || topicName.trim().length === 0) {
        throw new Error("Invalid topic name");
    }

    const sns = new AWS.SNS({apiVersion: "2010-03-31"});
    const topics = await sns.listTopics().promise();

    if (!topics.Topics || !Array.isArray(topics.Topics)) {
        throw new Error("Failed to list topics");
    }

    const topic = topics.Topics.find((topic) =>
        topic.TopicArn?.includes(topicName)
    );

    return topic?.TopicArn || null;
};

/**
 * Creates an SNS topic with the specified name.
 @param topicName The name of the SNS topic to be created.
 @returns A promise that resolves with the Amazon Resource Name (ARN) of the created SNS topic.
 @throws If the topic name is invalid or the creation of the topic fails.
 */
const createTopic = async (topicName: string): Promise<string> => {
    if (!topicName || topicName.trim().length === 0) {
        throw new Error("Invalid topic name");
    }

    const sns = new AWS.SNS({apiVersion: "2010-03-31"});
    const data = await sns.createTopic({Name: topicName}).promise();

    if (!data.TopicArn) {
        throw new Error("Failed to create topic");
    }

    return data.TopicArn;
};

/**
 * Publishes a message to an SNS topic.
 @param data The data to be sent as a string.
 @param topicArn The Amazon Resource Name (ARN) of the SNS topic to which the message should be published.
 @param subject The subject of the message (optional).
 @returns A promise that resolves with the response from SNS.
 */
const publishMessage = async (
    data: string,
    topicArn: string,
    subject?: string
) => {
    const params = {
        Message: data,
        Subject: subject,
        TopicArn: topicArn,
    };

    try {
        return await sns.publish(params).promise();
    } catch (e) {
        console.log(e);
    }
};

/**
 * Create topic if not found
 * @param topicName topic name
 * @returns Promise<string> topicArn
 */
const createTopicIfNotFound = async (topicName: string) => {
    let topicArn = await checkIfTopicExists(topicName);
    if (!topicArn) {
        topicArn = await createTopic(topicName);
    }
    return topicArn
}

export {checkIfTopicExists, createTopicIfNotFound, createTopic, publishMessage};