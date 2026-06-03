import { ServiceAction } from "./services/serviceBaseModels";

export function routeServiceAction(request: Request): ServiceAction {
    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname === '/createOrder') {
        return ServiceAction.CREATE_ORDER
    }
    if (request.method === 'POST' && url.pathname === '/increaseOrderCounter') {
        return ServiceAction.INCREASE_ORDER_COUNTER
    }

    return ServiceAction.UNKNOWN
}