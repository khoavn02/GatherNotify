import {createTopicIfNotFound, publishMessage} from "../sns";

class Notify {

    /**
     * Sends a message to an SNS topic.
     @param type The type of message, e.g. "Email".
     @param data The data to be sent.
     @param subject The subject of the message (optional).
     @returns Promise that resolves with the response from SNS.
     */
    static notify = async (type: string, data: unknown, subject?: string) => {
        const topicArn = await createTopicIfNotFound(type)
        return await publishMessage(JSON.stringify(data), topicArn, subject);
    }
}

export default Notify