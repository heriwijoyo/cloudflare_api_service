import { ServiceContext, ServiceError, ServiceResultCode } from "../../serviceBaseModels";
import { AccIdentifierType, Accumulation, AccumulationCycle, AccumulationKey, Product, ServiceTierCode } from "../../model/bizModel";
import { fetchServiceTier } from "../../repository/serviceTierQuery";
import { simplifiedYearMonth, simplifiedYearMonthDate, simplifiedYearMonthWeek } from "../../../utils/dateUtil";
import { createAccumulation, fetchAccumulation } from "../../repository/accumulationQuery";
import { logBizLimitExceeded } from "../../../logger/serviceLogger";
import { createProductAndAccumulate } from "../../repository/productQuery";

export async function innerServiceProductCreate(
    serviceContext: ServiceContext,
    userId: string,
    product: Product
): Promise<void> {
    /**
     * TODO: fetch service tier by userId.
     * or even better create `user_service_contract` table to store the service tier by user.
     * this contract will have active start and end time.
     * with this way, we'll have static snapshot of service tier when the contract is created.
     * if the business decide to change the service tier schema, it will only affect the new contract.
     * 
     * as we are running this code as a demo, we'll use simplest mechanisme to fetch service tier by userId.
     * its just a simulation
     */

    const serviceTier = await fetchServiceTier(serviceContext, ServiceTierCode.FREE)
    if (!serviceTier) {
        throw new ServiceError(ServiceResultCode.SYSTEM_ERROR, "Service tier not found")
    }

    const accumulationRules = serviceTier.accumulationRules.filter(rule => {
        return rule.identifierType === AccIdentifierType.USER && rule.accumulationKey === AccumulationKey.PRODUCT
    })

    if (!accumulationRules || accumulationRules.length === 0) {
        throw new ServiceError(ServiceResultCode.SYSTEM_ERROR, "Accumulation rules not found")
    }

    // if the app allow batch product creation, then we should handle this value accordingly
    // in this scenario, the app only allow single product creation, so the accumulate value is always 1
    const accumulateValue = 1

    const bizExceedLimits: {
        identifierType: AccIdentifierType
        identifier: string
        accumulationKey: AccumulationKey
        accumulationCycle: AccumulationCycle
        accumulationCycleId: string
        accumulationLimit: number
        currentAccumulation: number
    }[] = []

    const accumulations: Accumulation[] = []

    for (const rule of accumulationRules) {
        const cycleId = getCycleId(rule.accumulationCycle, Date.now())
        let accumulation = await fetchAccumulation(
            serviceContext, AccIdentifierType.USER, userId, AccumulationKey.PRODUCT, rule.accumulationCycle, cycleId
        )
        if (!accumulation) {
            accumulation = {
                accumulationId: crypto.randomUUID(),
                identifierType: AccIdentifierType.USER,
                identifier: userId,
                accumulationKey: AccumulationKey.PRODUCT,
                accumulationCycle: rule.accumulationCycle,
                accumulationCycleId: cycleId,
                accumulationValue: 0
            }
            await createAccumulation(serviceContext, accumulation)
        }

        const futureAccumulationValue = accumulation.accumulationValue + accumulateValue
        if (futureAccumulationValue > rule.maxLimit) {
            bizExceedLimits.push({
                identifierType: rule.identifierType,
                identifier: userId,
                accumulationKey: rule.accumulationKey,
                accumulationCycle: rule.accumulationCycle,
                accumulationCycleId: cycleId,
                accumulationLimit: rule.maxLimit,
                currentAccumulation: futureAccumulationValue
            })
        } else {
            accumulation.accumulationValue = futureAccumulationValue
            accumulations.push(accumulation)
        }
    }

    if (bizExceedLimits.length > 0) {
        await logBizLimitExceeded(serviceContext, bizExceedLimits)
        throw new ServiceError(
            ServiceResultCode.LIMIT_EXCEEDED,
            "Limit exceeded"
        )
    }

    await createProductAndAccumulate(serviceContext, product, accumulations)
}

function getCycleId(cycle: AccumulationCycle, time: number): string {
    switch (cycle) {
        case AccumulationCycle.LIFETIME:
            return AccumulationCycle.LIFETIME
        case AccumulationCycle.DAILY:
            return simplifiedYearMonthDate(time)
        case AccumulationCycle.WEEKLY:
            return simplifiedYearMonthWeek(time)
        case AccumulationCycle.MONTHLY:
            return simplifiedYearMonth(time)
    }
}
