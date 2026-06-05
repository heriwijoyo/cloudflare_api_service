import { routeServiceAction } from "./actionRouter";
import { randomUUID } from "crypto";
import { ServiceAction, ServiceContext, ServiceRequest, ServiceResult, ServiceResultCode } from "./services/serviceBaseModels";
import { Env } from "./env";
import { composeBizOrderServiceCreateRequest, composeServiceRequest } from "./services/biz/requestComposer";
import { bizOrderServiceCreate, BizOrderServiceCreateRequest } from "./services/biz/bizOrderService";
import { simulateQueueAndSendMail } from "./services/biz/bizMailService";
import { bizProductServiceCreate } from "./services/biz/bizProductService";

export { QueueEmailSenderDO } from "./services/durableObject/queueEmailSender";
export { ProductServiceDO } from "./services/durableObject/productService";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {

		const traceId = randomUUID()
		let requestJson
		try {
			requestJson = await request.json()
		} catch (error) {
			return Response.json({
				success: false,
				code: ServiceResultCode.PARAM_ILLEGAL,
				message: 'malformed json payload',
				traceId: traceId
			})
		}

		const serviceContext: ServiceContext = {
			env: env,
			traceId: traceId
		}

		let serviceRequest: ServiceRequest
		let serviceResult: ServiceResult
		const action = routeServiceAction(request)

		switch (action) {
			case ServiceAction.CREATE_ORDER:
				serviceRequest = composeBizOrderServiceCreateRequest(serviceContext, requestJson)
				serviceResult = await bizOrderServiceCreate(serviceRequest as BizOrderServiceCreateRequest)
				break

			case ServiceAction.SIMULATE_QUEUE_AND_SEND_MAIL:
				serviceRequest = composeServiceRequest(serviceContext)
				serviceResult = await simulateQueueAndSendMail(serviceRequest)
				break

			case ServiceAction.SIMULATE_CREATE_PRODUCT_AND_ACCUMULATE:
				serviceRequest = composeServiceRequest(serviceContext)
				serviceResult = await bizProductServiceCreate(serviceRequest)
				break

			default:
				serviceResult = composeResultNotFound(traceId)
				break
		}

		return Response.json(serviceResult)
	},
} satisfies ExportedHandler<Env>;

function composeResultNotFound(traceId: string): ServiceResult {
	return {
		success: false,
		code: ServiceResultCode.RESOURCE_NOT_FOUND,
		message: 'resource not found',
		traceId: traceId
	}
}