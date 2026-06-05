import { DurableObject } from "cloudflare:workers";
import { Env } from "../../env";
import { ServiceAction, ServiceContext, ServiceResult, ServiceResultCode } from "../serviceBaseModels";
import { Product } from "../model/bizModel";
import { executeDurableServiceProcess } from "../serviceProcessTemplate";
import { innerServiceProductCreate } from "../biz/innerService/innerProductService";

export class ProductServiceDO extends DurableObject {
    private svcEnv: Env

    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env)
        this.svcEnv = env
    }

    async createProductAndAccumulate(
        serviceContext: ServiceContext,
        userId: string,
        product: Product
    ): Promise<ServiceResult> {
        serviceContext.env = this.svcEnv

        let result: ServiceResult

        await this.ctx.blockConcurrencyWhile(async () => {
            result = await executeDurableServiceProcess(
                ServiceAction.DO_CREATE_PRODUCT_AND_ACCUMULATE,
                serviceContext,
                async function (): Promise<ServiceResult> {
                    await innerServiceProductCreate(serviceContext, userId, product)
                    return {
                        success: true,
                        code: ServiceResultCode.SUCCESS,
                        message: "Operation successful",
                        traceId: serviceContext.traceId
                    }
                }
            )
        })

        return result!
    }
}