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