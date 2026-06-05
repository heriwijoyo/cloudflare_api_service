import { request } from "http";
import { logServiceProcess } from "../logger/serviceLogger";
import { ServiceAction, ServiceContext, ServiceError, ServiceRequest, ServiceResult, ServiceResultCode } from "./serviceBaseModels";

export async function executeServiceProcess(
    action: ServiceAction,
    request: ServiceRequest,
    validateParams: () => void,
    executeAction: () => Promise<ServiceResult>
): Promise<ServiceResult> {
    const startTime = performance.now()
    let result: ServiceResult

    try {
        validateParams()
        result = await executeAction()
    } catch (error: unknown) {
        if (error instanceof ServiceError) {
            result = {
                success: false,
                code: error.code,
                message: error.message,
                traceId: request.context.traceId
            }
        } else if (error instanceof Error) {
            result = {
                success: false,
                code: ServiceResultCode.SYSTEM_ERROR,
                message: error.message,
                traceId: request.context.traceId
            }
        } else {
            result = {
                success: false,
                code: ServiceResultCode.SYSTEM_ERROR,
                message: "unexpected system error",
                traceId: request.context.traceId
            }
        }
    }

    const endTime = performance.now()
    await logServiceProcess(action, request.context, startTime, endTime, result)

    return result
}

export async function executeDurableServiceProcess(
    action: ServiceAction,
    serviceContext: ServiceContext,
    executeAction: () => Promise<ServiceResult>
): Promise<ServiceResult> {
    const startTime = performance.now()
    let result: ServiceResult

    try {
        result = await executeAction()
    } catch (error: unknown) {
        if (error instanceof ServiceError) {
            result = {
                success: false,
                code: error.code,
                message: error.message,
                traceId: serviceContext.traceId
            }
        } else if (error instanceof Error) {
            result = {
                success: false,
                code: ServiceResultCode.SYSTEM_ERROR,
                message: error.message,
                traceId: serviceContext.traceId
            }
        } else {
            result = {
                success: false,
                code: ServiceResultCode.SYSTEM_ERROR,
                message: "unexpected system error",
                traceId: serviceContext.traceId
            }
        }
    }

    const endTime = performance.now()
    await logServiceProcess(action, serviceContext, startTime, endTime, result)

    return result
}