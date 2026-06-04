import { QueueEmailSenderDO } from "./services/durableObject/queueEmailSender"

export interface Env {
    ENV: string
    DB: D1Database
    QUEUE_MAIL_SENDER: DurableObjectNamespace<QueueEmailSenderDO>
    QUEUE_MAIL_SENDER_DELAY: number
}