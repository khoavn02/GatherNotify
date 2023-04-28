import GatherSNS from "../sns";

const topicName = 'Log'


class LokiLogger extends GatherSNS {

    constructor(private readonly region: string, private readonly accessKeyId: string, private readonly secretAccessKey: string) {
        super(region, accessKeyId, secretAccessKey);
    }

    log = async (message: string) => {
        const topicArn = await this.createTopicIfNotFound(topicName)
        await this.publishMessage(message, topicArn)
    }

    info = async (message: unknown) => {
        await this.log(`[Info] -- ${JSON.stringify(message)}`)
    }

    error = async (message: unknown) => {
        await this.log(`[Error] -- ${JSON.stringify(message)}`)
    }

    warning = async (message: unknown) => {
        await this.log(`[Warning] -- ${JSON.stringify(message)}`)
    }

    debug = async (message: unknown) => {
        await this.log(`[Debug] -- ${JSON.stringify(message)}`)
    }
}

export default LokiLogger
