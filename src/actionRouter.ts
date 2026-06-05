import { ServiceAction } from "./services/serviceBaseModels";

export function routeServiceAction(request: Request): ServiceAction {
    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname === '/createOrder') {
        return ServiceAction.CREATE_ORDER
    }
    if (request.method === 'POST' && url.pathname === '/simulateQueueAndSendMail') {
        return ServiceAction.SIMULATE_QUEUE_AND_SEND_MAIL
    }
    if (request.method === 'POST' && url.pathname === '/simulateProductCreateAndAccumulate') {
        return ServiceAction.SIMULATE_CREATE_PRODUCT_AND_ACCUMULATE
    }

    return ServiceAction.UNKNOWN
}