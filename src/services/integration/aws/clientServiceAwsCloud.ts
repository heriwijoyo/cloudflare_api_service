import { QueueMailSend } from "../../model/bizModel";
import { ServiceContext } from "../../serviceBaseModels";

export async function amazonSesSendQueueMail(
    serviceContext: ServiceContext,
    queueMailSend: QueueMailSend
): Promise<boolean> {
    /* TODO:
    1. parse the subject template, content html template and content text template with real values from variables
    2. construct the request
    3. make the call to amazon ses
    4. return true if success, return false if failed
    */
    return true
}