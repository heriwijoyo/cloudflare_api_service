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

export interface QueueMailSend {
    queueMailSendId: number
    traceId: string
    scenario: string
    priority: number
    sender: string
    receiver: string
    templateSubject: string
    templateContentHtml: string
    templateContentText: string
    variables: string
    status: QueueStatus
    maxRetryCount: number
    retryCount: number
}