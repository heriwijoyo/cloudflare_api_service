import { DurableObject } from "cloudflare:workers"
import { Env } from "../../env"
import { ServiceContext } from "../serviceBaseModels"
import { fetchPrioritizedQueueMailSend, updateStatusAndRetryCount } from "../repository/mailSenderQueueQuery"
import { logQueueMailSendExecution } from "../../logger/serviceLogger"
import { amazonSesSendQueueMail } from "../integration/aws/clientServiceAwsCloud"
import { QueueStatus } from "../model/bizModel"

export class QueueEmailSenderDO extends DurableObject {
    private svcEnv: Env

    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env)
        this.svcEnv = env
    }

    async enqueue(): Promise<void> {
        const existingAlarm = await this.ctx.storage.getAlarm()
        if (existingAlarm === null) {
            await this.ctx.storage.setAlarm(Date.now())
        }
    }

    async alarm(): Promise<void> {
        const startTime = performance.now()
        let shouldSetNextAlarm = false

        let success = false
        let message: string | null = null

        const context: ServiceContext = {
            env: this.svcEnv,
            traceId: 'QUEUE_EMAIL_SENDER_EXECUTION_' + crypto.randomUUID()
        }

        try {
            const queueMailSend = await fetchPrioritizedQueueMailSend(context)
            if (!queueMailSend) {
                success = true
                message = 'empty queue'
                shouldSetNextAlarm = false
            } else {
                context.traceId = queueMailSend.traceId
                success = await amazonSesSendQueueMail(context, queueMailSend)

                const retryCount = queueMailSend.retryCount + 1
                const updateStatus = success ? QueueStatus.SUCCESS
                    : retryCount >= queueMailSend.maxRetryCount ? QueueStatus.FAILED : QueueStatus.PENDING

                await updateStatusAndRetryCount(context, queueMailSend.queueMailSendId, updateStatus, retryCount)
                message = 'queue executed'
                shouldSetNextAlarm = true
            }
        } catch (error) {
            success = false
            message = String(error)
            shouldSetNextAlarm = true
        }

        await logQueueMailSendExecution(
            context, startTime, performance.now(), success, message
        )

        if (shouldSetNextAlarm) {
            await this.ctx.storage.setAlarm(Date.now() + this.svcEnv.MAIL_SENDER_CONFIG.QUEUE_SEND_DELAY)
        }
    }
}