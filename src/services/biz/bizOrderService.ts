import { randomUUID } from "crypto";
import { assertNotBlank } from "../../utils/serviceAssertUtil";
import { Order, OrderItem } from "../model/bizModel";
import { getProductsByIds } from "../repository/productQuery";
import { ServiceAction, ServiceError, ServiceRequest, ServiceResult, ServiceResultCode } from "../serviceBaseModels";
import { executeServiceProcess } from "../serviceProcessTemplate";
import { createOrder } from "../repository/bizOrderQuery";

export interface BizOrderServiceCreateRequest extends ServiceRequest {
    userId: string
    products: {
        productId: string
        quantity: number
    }[]
}

export async function bizOrderServiceCreate(
    request: BizOrderServiceCreateRequest
): Promise<ServiceResult> {
    return await executeServiceProcess(
        ServiceAction.CREATE_ORDER, request,
        function () {
            assertNotBlank(request.userId, ServiceResultCode.PARAM_ILLEGAL, 'userId is required')
        },
        async function (): Promise<ServiceResult> {
            const productIds = request.products.map(p => p.productId)
            const products = await getProductsByIds(request.context, productIds)

            const orderId = randomUUID()
            const orderItems: OrderItem[] = request.products.map(r => {
                const product = products.find(p => p.productId === r.productId)
                if (!product) {
                    throw new ServiceError(ServiceResultCode.PARAM_ILLEGAL, 'product not found')
                }
                return {
                    orderItemId: randomUUID(),
                    orderId: orderId,
                    productId: r.productId,
                    quantity: r.quantity,
                    price: product.price
                }
            })

            const order: Order = {
                orderId: orderId,
                userId: request.userId,
                orderDate: new Date().toISOString(),
                totalItems: request.products.length,
                totalAmount: request.products.reduce((sum, p) => {
                    const product = products.find(product => product.productId === p.productId)
                    if (!product) {
                        throw new ServiceError(ServiceResultCode.PARAM_ILLEGAL, `product ${p.productId} not found`)
                    }
                    return sum + p.quantity * product.price
                }, 0),
                orderItems: orderItems
            }

            await createOrder(request.context, order)

            return {
                success: true,
                code: ServiceResultCode.SUCCESS,
                message: 'Order created successfully',
                traceId: request.context.traceId
            }
        }
    )
}