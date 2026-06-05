import { Product } from "../model/bizModel";
import { ServiceAction, ServiceRequest, ServiceResult } from "../serviceBaseModels";
import { executeServiceProcess } from "../serviceProcessTemplate";

export async function bizProductServiceCreate(
    request: ServiceRequest
): Promise<ServiceResult> {
    return await executeServiceProcess(
        ServiceAction.SIMULATE_CREATE_PRODUCT_AND_ACCUMULATE, request,
        function () { },
        async function (): Promise<ServiceResult> {

            //TODO: get userId from login session
            const userId = 'demoUser12345'

            //TODO: get product info from request
            const product: Product = {
                productId: crypto.randomUUID(),
                name: `product-${Date.now()}`,
                price: Math.floor(Math.random() * 1000)
            }

            const productServiceDO = request.context.env.PRODUCT_SERVICE_DO.getByName(userId)
            return await productServiceDO.createProductAndAccumulate(
                request.context, userId, product
            )
        }
    )
}