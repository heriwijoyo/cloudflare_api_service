import { QueueEmailSenderDO } from "./services/durableObject/queueEmailSender"

export interface Env {
    ENV: string
    DB: D1Database
    QUEUE_MAIL_SENDER_DO: DurableObjectNamespace<QueueEmailSenderDO>
    MAIL_SENDER_CONFIG: {
        QUEUE_SEND_DELAY: number
        AWS_SES_REGION: string
        AWS_SES_FROM_ADDRESS: string
    }
}