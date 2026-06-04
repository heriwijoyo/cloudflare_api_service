import { BatchQueryOperation, QueryOperation } from "../../database/queryOperation"
import { executeBatchQuery, executeSingleQuery, QueryResult } from "../../database/queryTemplates"
import { assertQueryResultSuccess } from "../../utils/serviceAssertUtil"
import { MailScenario, QueueMailSend, QueueStatus } from "../model/bizModel"
import { ServiceContext, ServiceError, ServiceResultCode } from "../serviceBaseModels"

export interface QueueMailSendRow {
    queue_mail_send_id: number
    trace_id: string
    scenario: string
    priority: number
    sender: string
    receiver: string
    template_subject: string
    template_content_html: string
    template_content_text: string
    variables: string
    status: number
    retry_count: number
    max_retry_count: number
}

export async function insertQueueMailSend(
    serviceContext: ServiceContext,
    queueMailSends: QueueMailSend[]
) {
    const operations = queueMailSends.map(() => QueryOperation.CREATE_QUEUE_MAIL_SEND)
    const result = await executeBatchQuery(
        serviceContext, BatchQueryOperation.CREATE_QUEUE_MAIL_SEND,
        function (operation: QueryOperation, table: string, index: number): D1PreparedStatement {
            switch (operation) {
                case QueryOperation.CREATE_QUEUE_MAIL_SEND:
                    return serviceContext.env.DB.prepare(`
                            INSERT INTO ${table} (
                                trace_id,
                                scenario,
                                priority,
                                sender,
                                receiver,
                                template_subject,
                                template_content_html,
                                template_content_text,
                                variables,
                                status,
                                retry_count,
                                max_retry_count
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `)
                        .bind(
                            serviceContext.traceId,
                            queueMailSends[index].scenario,
                            queueMailSends[index].priority,
                            queueMailSends[index].sender,
                            queueMailSends[index].receiver,
                            queueMailSends[index].templateSubject,
                            queueMailSends[index].templateContentHtml,
                            queueMailSends[index].templateContentText,
                            JSON.stringify(queueMailSends[index].variables),
                            queueMailSends[index].status,
                            queueMailSends[index].retryCount,
                            queueMailSends[index].maxRetryCount
                        )

                default:
                    throw new ServiceError(
                        ServiceResultCode.UNSUPPORTED_OPERATION,
                        `operation ${operation} not supported`
                    )
            }
        },
        ...operations
    )
    assertQueryResultSuccess(result, BatchQueryOperation.CREATE_QUEUE_MAIL_SEND)
}

export async function fetchPrioritizedQueueMailSend(
    serviceContext: ServiceContext
): Promise<QueueMailSend | null> {
    const result = await executeSingleQuery(
        serviceContext, QueryOperation.READ_QUEUE_MAIL_SEND_PRIORITIZED,
        async function (table: string, result: QueryResult) {
            const execResult = await serviceContext.env.DB.prepare(`
                    SELECT * FROM ${table}
                    WHERE status = ?
                    ORDER BY priority ASC
                    LIMIT 1
                `)
                .bind(QueueStatus.INIT)
                .all<QueueMailSendRow>();

            result.success = true
            result.rows = execResult.results
            result.dbDuration = execResult.meta.duration
        }
    )
    assertQueryResultSuccess(result, QueryOperation.READ_QUEUE_MAIL_SEND_PRIORITIZED)
    if (result.rows) {
        return convertQueueMailSend(result.rows[0])
    }
    return null
}

export async function updateStatusAndRetryCount(
    serviceContext: ServiceContext,
    queueMailSendId: number,
    status: QueueStatus,
    retryCount: number
) {
    const result = await executeSingleQuery(
        serviceContext, QueryOperation.UPDATE_QUEUE_MAIL_SEND_STATUS_AND_RETRY_COUNT,
        async function (table: string, result: QueryResult) {
            const execResult = await serviceContext.env.DB.prepare(`
                    UPDATE ${table}
                    SET status = ?, retry_count = ?
                    WHERE queue_mail_send_id = ?
                `)
                .bind(status, retryCount, queueMailSendId)
                .run();

            result.success = true
            result.rows = execResult.results
            result.dbDuration = execResult.meta.duration
        }
    )
    assertQueryResultSuccess(result, QueryOperation.UPDATE_QUEUE_MAIL_SEND_STATUS_AND_RETRY_COUNT)
}

function convertQueueMailSend(row: QueueMailSendRow): QueueMailSend {
    return {
        queueMailSendId: row.queue_mail_send_id,
        traceId: row.trace_id,
        scenario: row.scenario as MailScenario,
        priority: row.priority,
        sender: row.sender,
        receiver: row.receiver,
        templateSubject: row.template_subject,
        templateContentHtml: row.template_content_html,
        templateContentText: row.template_content_text,
        variables: JSON.parse(row.variables),
        status: row.status as QueueStatus,
        maxRetryCount: row.max_retry_count,
        retryCount: row.retry_count
    }
}