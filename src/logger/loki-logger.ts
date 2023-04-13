import {createTopicIfNotFound, publishMessage} from "../sns";

const topicName = 'Log'


class LokiLogger {
    static log = async (message: string) => {
        const topicArn = await createTopicIfNotFound(topicName)
        await publishMessage(message, topicArn)
    }

    static info = async (message: unknown) => {
        await this.log(`[Info] -- ${JSON.stringify(message)}`)
    }

    static error = async (message: unknown) => {
        await this.log(`[Error] -- ${JSON.stringify(message)}`)
    }

    static warning = async (message: unknown) => {
        await this.log(`[Warning] -- ${JSON.stringify(message)}`)
    }

    static debug = async (message: unknown) => {
        await this.log(`[Debug] -- ${JSON.stringify(message)}`)
    }
}

export default LokiLogger
