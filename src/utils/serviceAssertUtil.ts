import { QueryResult } from "../database/queryTemplates"
import { ServiceError, ServiceResultCode } from "../services/serviceBaseModels"

export function assertNotBlank(
    param: string | number | null | undefined,
    resultCode: ServiceResultCode,
    message: string
) {
    if (!param) {
        throw new ServiceError(
            resultCode,
            message
        )
    }
    if (typeof param === "string") {
        if (!param.trim()) {
            throw new ServiceError(
                resultCode,
                message
            )
        }
    }
}

export function assertQueryResultSuccess(
    queryResult: QueryResult,
    resultCode: ServiceResultCode,
    message: string
) {
    if (!queryResult.success) {
        throw new ServiceError(
            resultCode,
            message
        )
    }
}