export interface Product {
    productId: string
    name: string
    price: number
}

export interface OrderItem {
    orderItemId: string
    orderId: string
    productId: string
    quantity: number
    price: number
}

export interface Order {
    orderId: string
    userId: string
    orderDate: string
    totalItems: number
    totalAmount: number
    orderItems: OrderItem[]
}

export enum QueueStatus {
    INIT = 0,
    SUCCESS = 1,
    FAILED = 2,
    PENDING = 3
}

export enum MailScenario {
    OTP = 'OTP',
    REGISTRATION = 'REGISTRATION',
    ORDER = 'ORDER'
}

export interface QueueMailSend {
    queueMailSendId: number
    traceId: string
    scenario: MailScenario
    priority: number
    sender: string
    receiver: string
    templateSubject: string
    templateContentHtml: string
    templateContentText: string
    variables: {
        key: string
        value: string
    }[]
    status: QueueStatus
    maxRetryCount: number
    retryCount: number
}

export function mailPriority(scenario: MailScenario): number {
    switch (scenario) {
        case MailScenario.OTP:
            return 10
        case MailScenario.REGISTRATION:
            return 30
        case MailScenario.ORDER:
            return 20
    }
}

export enum ServiceTierCode {
    FREE = 'FREE',
    PLUS = 'PLUS',
    PRO = 'PRO'
}

export interface AccumulationRule {
    identifierType: AccIdentifierType
    accumulationKey: AccumulationKey
    accumulationCycle: AccumulationCycle
    maxLimit: number
}

export interface ServiceTier {
    serviceTierCode: ServiceTierCode
    accumulationRules: AccumulationRule[]
}

export enum AccIdentifierType {
    USER = 'USER'
}

export enum AccumulationKey {
    PRODUCT = 'PRODUCT',
    ORDER = 'ORDER'
}

export enum AccumulationCycle {
    LIFETIME = 'LIFETIME',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY'
}

export interface Accumulation {
    accumulationId: string
    identifierType: AccIdentifierType
    identifier: string
    accumulationKey: AccumulationKey
    accumulationCycle: AccumulationCycle
    accumulationCycleId: string
    accumulationValue: number
}