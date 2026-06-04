import { mailPriority, MailScenario, QueueMailSend, QueueStatus } from "../model/bizModel";
import { insertQueueMailSend } from "../repository/mailSenderQueueQuery";
import { ServiceAction, ServiceContext, ServiceRequest, ServiceResult, ServiceResultCode } from "../serviceBaseModels";
import { executeServiceProcess } from "../serviceProcessTemplate";
import { MailTemplate } from "./bizMailTemplate";

export async function simulateQueueAndSendMail(
    request: ServiceRequest
): Promise<ServiceResult> {
    return await executeServiceProcess(
        ServiceAction.SIMULATE_QUEUE_AND_SEND_MAIL, request,
        function () { },
        async function (): Promise<ServiceResult> {

            const queueMailSends = [
                composeQueueMailSendRegistration(request.context),
                composeQueueMailSendOrder(request.context),
                composeQueueMailSendOtp(request.context)
            ]

            await insertQueueMailSend(request.context, queueMailSends)

            const queueMailSender = request.context.env.QUEUE_MAIL_SENDER_DO.getByName('queue-mail-sender')
            await queueMailSender.enqueue()

            return {
                success: true,
                code: ServiceResultCode.SUCCESS,
                message: 'simulate queue and send mail success',
                traceId: request.context.traceId
            }
        }
    )
}

function composeQueueMailSendOtp(context: ServiceContext): QueueMailSend {
    return {
        queueMailSendId: 0,
        traceId: context.traceId,
        scenario: MailScenario.OTP,
        priority: mailPriority(MailScenario.OTP),
        sender: context.env.MAIL_SENDER_CONFIG.AWS_SES_FROM_ADDRESS,
        receiver: 'user@mail.com',
        templateSubject: MailTemplate.Subject.OTP,
        templateContentText: MailTemplate.TextBody.OTP,
        templateContentHtml: MailTemplate.HtmlBody.OTP,
        variables: [
            { key: 'USER_NAME', value: 'John Doe' },
            { key: 'OTP_CODE', value: '123456' },
            { key: 'OTP_EXPIRY_MINUTES', value: '5' },
            { key: 'APP_NAME', value: 'Demo' }
        ],
        status: QueueStatus.INIT,
        maxRetryCount: 1,
        retryCount: 0
    }
}

function composeQueueMailSendRegistration(context: ServiceContext): QueueMailSend {
    return {
        queueMailSendId: 0,
        traceId: context.traceId,
        scenario: MailScenario.REGISTRATION,
        priority: mailPriority(MailScenario.REGISTRATION),
        sender: context.env.MAIL_SENDER_CONFIG.AWS_SES_FROM_ADDRESS,
        receiver: 'user@mail.com',
        templateSubject: MailTemplate.Subject.REGISTRATION,
        templateContentText: MailTemplate.TextBody.REGISTRATION,
        templateContentHtml: MailTemplate.HtmlBody.REGISTRATION,
        variables: [
            { key: 'USER_NAME', value: 'John Doe' },
            { key: 'APP_NAME', value: 'Demo' }
        ],
        status: QueueStatus.INIT,
        maxRetryCount: 1,
        retryCount: 0
    }
}

function composeQueueMailSendOrder(context: ServiceContext): QueueMailSend {
    return {
        queueMailSendId: 0,
        traceId: context.traceId,
        scenario: MailScenario.ORDER,
        priority: mailPriority(MailScenario.ORDER),
        sender: context.env.MAIL_SENDER_CONFIG.AWS_SES_FROM_ADDRESS,
        receiver: 'user@mail.com',
        templateSubject: MailTemplate.Subject.ORDER,
        templateContentText: MailTemplate.TextBody.ORDER,
        templateContentHtml: MailTemplate.HtmlBody.ORDER,
        variables: [
            { key: 'USER_NAME', value: 'John Doe' },
            { key: 'APP_NAME', value: 'Demo' }
        ],
        status: QueueStatus.INIT,
        maxRetryCount: 1,
        retryCount: 0
    }
}