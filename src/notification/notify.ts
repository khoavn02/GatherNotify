import {checkIfTopicExists, createTopic, publishMessage} from "../sns";


/**
 * Sends a message to an SNS topic.
 @param type The type of message, e.g. "Email".
 @param data The data to be sent.
 @param subject The subject of the message (optional).
 @returns Promise that resolves with the response from SNS.
 */
export async function notify(type: string, data: unknown, subject?: string) {
    let topicArn = await checkIfTopicExists(type);

    if (!topicArn) {
        topicArn = await createTopic(type);
    }

    return await publishMessage(JSON.stringify(data), topicArn, subject);
}
