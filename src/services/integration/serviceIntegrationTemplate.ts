import { logIntegrationProcess } from "../../logger/serviceLogger";
import { ServiceContext } from "../serviceBaseModels";
import { ExternalRequest } from "./serviceIntegrationModel";

export async function callExternalService(
    serviceContext: ServiceContext,
    request: ExternalRequest,
    process: () => Promise<Response>
): Promise<Response | null> {
    const startTime = performance.now()
    let response: Response | null = null
    let success = false
    let errorMessage: string | null = null

    try {
        response = await process()
        success = true
    } catch (error) {
        success = false
        errorMessage = String(error)
    }

    const endTime = performance.now()

    await logIntegrationProcess(
        serviceContext, startTime, endTime, success, errorMessage, request, response
    )

    return response
}