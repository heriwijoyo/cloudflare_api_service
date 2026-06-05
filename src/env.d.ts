import { QueueEmailSenderDO } from "./services/durableObject/queueEmailSender"
import { ProductServiceDO } from "./services/durableObject/productService"

export interface Env {
    ENV: string
    DB: D1Database
    QUEUE_MAIL_SENDER_DO: DurableObjectNamespace<QueueEmailSenderDO>
    PRODUCT_SERVICE_DO: DurableObjectNamespace<ProductServiceDO>
    MAIL_SENDER_CONFIG: {
        QUEUE_SEND_DELAY: number
        AWS_SES_REGION: string
        AWS_SES_FROM_ADDRESS: string
    }
}