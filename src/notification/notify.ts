import GatherSNS from "../sns";

class Notify extends GatherSNS {

    constructor(private readonly region: string, private readonly accessKeyId: string, private readonly secretAccessKey: string) {
        super(region, accessKeyId, secretAccessKey);
    }

    /**
     * Sends a message to an SNS topic.
     @param type The type of message, e.g. "Email".
     @param data The data to be sent.
     @param subject The subject of the message (optional).
     @returns Promise that resolves with the response from SNS.
     */
    notify = async (type: string, data: unknown, subject?: string) => {
        const topicArn = await this.createTopicIfNotFound(type)
        return await this.publishMessage(JSON.stringify(data), topicArn, subject);
    }
}

export default Notify