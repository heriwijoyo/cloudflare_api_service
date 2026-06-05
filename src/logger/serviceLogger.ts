import { BatchQueryOperation, QueryOperation } from "../database/queryOperation";
import { QueryResult } from "../database/queryTemplates";
import { ExternalRequest } from "../services/integration/serviceIntegrationModel";
import { AccIdentifierType, AccumulationCycle, AccumulationKey } from "../services/model/bizModel";
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

export async function logIntegrationProcess(
    serviceContext: ServiceContext,
    startTime: number,
    endTime: number,
    success: boolean,
    errorMessage: string | null,
    request: ExternalRequest,
    response: Response | null
) {
    //TODO: Implement logging
}

export async function logQueueMailSendExecution(
    serviceContext: ServiceContext,
    startTime: number,
    endTime: number,
    success: boolean,
    message: string
) {
    //TODO: Implement logging
}

export async function logBizLimitExceeded(
    serviceContext: ServiceContext,
    bizExceedLimits: {
        identifierType: AccIdentifierType
        identifier: string
        accumulationKey: AccumulationKey
        accumulationCycle: AccumulationCycle
        accumulationCycleId: string
        accumulationLimit: number
        currentAccumulation: number
    }[]
) {
    //TODO: Implement logging
}