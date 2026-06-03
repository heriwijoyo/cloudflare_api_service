import { ServiceContext } from "../serviceBaseModels";
import { BizOrderServiceCreateRequest } from "./bizOrderService";

export function composeBizOrderServiceCreateRequest(
    context: ServiceContext,
    requestJson: any
): BizOrderServiceCreateRequest {
    const requestBody = requestJson as {
        userId: string
        products: {
            productId: string
            quantity: number
        }[]
    }
    return {
        context: context,
        userId: requestBody.userId,
        products: requestBody.products
    }
}