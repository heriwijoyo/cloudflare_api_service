import { BatchQueryOperation, QueryOperation } from "../database/queryOperation";
import { QueryResult } from "../database/queryTemplates";
import { ServiceAction, ServiceContext, ServiceResult } from "../services/serviceBaseModels";

export async function logServiceProcess(
    action: ServiceAction,
    serviceContext: ServiceContext,
    startTime: number,
    endTime: number,
    result: ServiceResult
) {
    //TODO: Implement logging
}

export async function logDbProcess(
    serviceContext: ServiceContext,
    operation: QueryOperation | BatchQueryOperation,
    result: QueryResult
) {
    //TODO: Implement logging
}

export async function logDbException(
    serviceContext: ServiceContext,
    operation: QueryOperation | BatchQueryOperation,
    message: string
) {
    //TODO: Implement logging
}