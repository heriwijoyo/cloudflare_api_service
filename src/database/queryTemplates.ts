import { logDbException, logDbProcess } from "../logger/serviceLogger";
import { ServiceContext } from "../services/serviceBaseModels";
import { BatchQueryOperation, getTable, QueryOperation } from "./queryOperation";
import { Table } from "./table";

export interface QueryResult {
    operation: QueryOperation | BatchQueryOperation
    success: boolean
    startTime: number
    endTime: number
    dbDuration: number
    rows?: any[]
}

export async function executeSingleQuery(
    serviceContext: ServiceContext,
    queryOperation: QueryOperation,
    process: (table: string, result: QueryResult) => Promise<void>
): Promise<QueryResult> {
    const result: QueryResult = {
        operation: queryOperation,
        success: false,
        startTime: performance.now(),
        endTime: 0,
        dbDuration: 0
    }
    const table = getTable(queryOperation)

    try {
        await process(table, result)
    } catch (error: unknown) {
        await logDbException(serviceContext, queryOperation, String(error))
    } finally {
        await logDbProcess(serviceContext, queryOperation, result)
    }

    return result
}

interface BatchOperation {
    operation: QueryOperation
    table: Table
    statement: D1PreparedStatement
}

export async function executeBatchQuery(
    serviceContext: ServiceContext,
    queryOperation: BatchQueryOperation,
    composeStatement: (operation: QueryOperation, table: string, index: number) => D1PreparedStatement,
    ...queryOperations: QueryOperation[]
): Promise<QueryResult> {
    const startTime = performance.now()
    const result: QueryResult = {
        operation: queryOperation,
        success: false,
        startTime: startTime,
        endTime: 0,
        dbDuration: 0
    }

    let results: D1Result[] = [];
    let batchOperations: BatchOperation[] = []

    try {
        for (let index = 0; index < queryOperations.length; index++) {
            const operation = queryOperations[index]!
            const table = getTable(operation)
            const statement = composeStatement(operation, table, index)
            batchOperations.push({
                operation: operation,
                table: table,
                statement: statement
            })
        }
        const statements = batchOperations.map(bo => bo.statement)

        results = await serviceContext.env.DB.batch(statements)
        result.success = true

    } catch (err: unknown) {
        await logDbException(serviceContext, queryOperation, String(err))
    }

    const endTime = performance.now()
    result.endTime = endTime
    //log overall batch process
    await logDbProcess(serviceContext, queryOperation, result)

    //log each batch operation
    for (let i = 0; i < batchOperations.length; i++) {
        const batchOperation = batchOperations[i]!
        const dbDuration = results[i]?.meta.duration || 0

        const operationResult: QueryResult = {
            operation: batchOperation.operation,
            success: results[i].success,
            startTime: startTime,
            endTime: endTime,
            dbDuration: dbDuration
        }
        await logDbProcess(serviceContext, batchOperation.operation, operationResult)
    }

    return result
}

export function composeDefaultStatement(db: D1Database): D1PreparedStatement {
    return db.prepare('SELECT 1 + 1')
}