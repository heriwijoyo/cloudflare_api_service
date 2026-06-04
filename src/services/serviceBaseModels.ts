import { Env } from "../env";

export enum ServiceAction {
    CREATE_ORDER = 'CREATE_ORDER',
    INCREASE_ORDER_COUNTER = 'INCREASE_ORDER_COUNTER',
    LIMIT_CHECK_AND_ACCUMULATE = 'LIMIT_CHECK_AND_ACCUMULATE',
    UNKNOWN = 'UNKNOWN'
}

export interface ServiceContext {
    traceId: string
    env: Env
}

export interface ServiceRequest {
    context: ServiceContext
}

export interface ServiceResult {
    success: boolean
    code: ServiceResultCode
    message: string
    traceId: string
}

export enum ServiceResultCode {
    SUCCESS = 'S000',
    SYSTEM_ERROR = 'E000',
    PARAM_ILLEGAL = 'E001',
    RESOURCE_NOT_FOUND = 'E002',
    UNSUPPORTED_OPERATION = 'E003',
    QUERY_OPERATION_FAILED = 'E004'
}

export class ServiceError extends Error {
    public readonly code: ServiceResultCode

    constructor(code: ServiceResultCode, message: string) {
        super(message)
        this.code = code
    }
}