import { QueryOperation } from "../../database/queryOperation";
import { executeSingleQuery, QueryResult } from "../../database/queryTemplates";
import { assertQueryResultSuccess } from "../../utils/serviceAssertUtil";
import { AccumulationRule, ServiceTier, ServiceTierCode } from "../model/bizModel";
import { ServiceContext } from "../serviceBaseModels";

export interface ServiceTierRow {
    service_tier_id: number;
    tier_name: string;
    config: string;
}

export async function fetchServiceTier(
    serviceContext: ServiceContext,
    tierCode: ServiceTierCode
): Promise<ServiceTier | null> {
    const result = await executeSingleQuery(
        serviceContext, QueryOperation.READ_SERVICE_TIER_BY_CODE,
        async function (table: string, result: QueryResult) {
            const execResult = await serviceContext.env.DB
                .prepare(`
                    SELECT * FROM ${table} WHERE tier_name = ?
                `)
                .bind(tierCode)
                .all<ServiceTierRow>()

            result.success = true
            result.rows = execResult.results
            result.dbDuration = execResult.meta.duration
        }
    )
    assertQueryResultSuccess(result, QueryOperation.READ_SERVICE_TIER_BY_CODE)
    if (result.rows) {
        return convertServiceTier(result.rows[0])
    }
    return null
}

function convertServiceTier(row: ServiceTierRow): ServiceTier {
    return {
        serviceTierCode: row.tier_name as ServiceTierCode,
        accumulationRules: JSON.parse(row.config) as AccumulationRule[]
    }
}