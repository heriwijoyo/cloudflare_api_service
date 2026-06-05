import { AccIdentifierType, Accumulation, AccumulationCycle, AccumulationKey } from "../model/bizModel";
import { ServiceContext } from "../serviceBaseModels";
import { QueryOperation } from "../../database/queryOperation";
import { assertQueryResultSuccess } from "../../utils/serviceAssertUtil";
import { executeSingleQuery, QueryResult } from "../../database/queryTemplates";

export interface AccumulationRow {
    accumulation_id: string;
    identifier_type: string;
    identifier: string;
    accumulation_key: string;
    accumulation_cycle: string;
    accumulation_cycle_id: string;
    accumulation_value: number;
}

export async function createAccumulation(
    serviceContext: ServiceContext,
    accumulation: Accumulation
): Promise<void> {
    const result = await executeSingleQuery(
        serviceContext, QueryOperation.CREATE_ACCUMULATION,
        async function (table: string, result: QueryResult) {
            const execResult = await serviceContext.env.DB
                .prepare(`
                    INSERT INTO ${table} (
                        accumulation_id,
                        identifier_type,
                        identifier,
                        accumulation_key,
                        accumulation_cycle,
                        accumulation_cycle_id,
                        accumulation_value
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `)
                .bind(
                    accumulation.accumulationId,
                    accumulation.identifierType,
                    accumulation.identifier,
                    accumulation.accumulationKey,
                    accumulation.accumulationCycle,
                    accumulation.accumulationCycleId,
                    accumulation.accumulationValue
                )
                .run()
            result.success = true
            result.dbDuration = execResult.meta.duration
        }
    )
    assertQueryResultSuccess(result, QueryOperation.CREATE_ACCUMULATION)
}

export async function updateAccumulation(
    serviceContext: ServiceContext,
    accumulation: Accumulation
): Promise<void> {
    const result = await executeSingleQuery(
        serviceContext, QueryOperation.UPDATE_ACCUMULATION,
        async function (table: string, result: QueryResult) {
            const execResult = await serviceContext.env.DB
                .prepare(`
                    UPDATE ${table}
                    SET accumulation_value = ?
                    WHERE accumulation_id = ?
                `)
                .bind(
                    accumulation.accumulationValue,
                    accumulation.accumulationId
                )
                .run()
            result.success = true
            result.dbDuration = execResult.meta.duration
        }
    )
    assertQueryResultSuccess(result, QueryOperation.UPDATE_ACCUMULATION)
}

export async function fetchAccumulation(
    serviceContext: ServiceContext,
    identifierType: AccIdentifierType,
    identifier: string,
    accumulationKey: AccumulationKey,
    accumulationCycle: AccumulationCycle,
    accumulationCycleId: string
): Promise<Accumulation | null> {
    const result = await executeSingleQuery(
        serviceContext, QueryOperation.READ_ACCUMULATION,
        async function (table: string, result: QueryResult) {
            const execResult = await serviceContext.env.DB
                .prepare(`
                    SELECT * FROM ${table}
                    WHERE identifier_type = ? 
                        AND identifier = ? 
                        AND accumulation_key = ? 
                        AND accumulation_cycle = ? 
                        AND accumulation_cycle_id = ?
                `)
                .bind(identifierType, identifier, accumulationKey, accumulationCycle, accumulationCycleId)
                .all<AccumulationRow>()
            result.success = true
            result.rows = execResult.results
            result.dbDuration = execResult.meta.duration
        }
    )
    assertQueryResultSuccess(result, QueryOperation.READ_ACCUMULATION)
    if (result.rows && result.rows.length > 0) {
        return convertAccumulation(result.rows[0])
    }
    return null
}

function convertAccumulation(row: AccumulationRow): Accumulation {
    return {
        accumulationId: row.accumulation_id,
        identifierType: row.identifier_type as AccIdentifierType,
        identifier: row.identifier,
        accumulationKey: row.accumulation_key as AccumulationKey,
        accumulationCycle: row.accumulation_cycle as AccumulationCycle,
        accumulationCycleId: row.accumulation_cycle_id,
        accumulationValue: row.accumulation_value
    }
}