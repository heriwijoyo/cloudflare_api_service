import { BatchQueryOperation, QueryOperation } from "../../database/queryOperation"
import { executeBatchQuery, executeSingleQuery, QueryResult } from "../../database/queryTemplates"
import { ServiceContext, ServiceError, ServiceResultCode } from "../serviceBaseModels"
import { Accumulation, Product } from "../model/bizModel"
import { assertQueryResultSuccess } from "../../utils/serviceAssertUtil"

export interface ProductRow {
    product_id: string
    name: string
    price: number
}

export async function getProductsByIds(
    serviceContext: ServiceContext,
    productIds: string[]
): Promise<Product[]> {
    const result = await executeSingleQuery(
        serviceContext, QueryOperation.READ_PRODUCT_BY_IDS,
        async function (table: string, result: QueryResult) {
            const placeholders = productIds.map(() => '?').join(',')
            const execResult = await serviceContext.env.DB
                .prepare(`
                    SELECT * FROM ${table}
                    WHERE product_id IN (${placeholders})
                `)
                .bind(...productIds)
                .all<ProductRow>();

            result.success = true
            result.rows = execResult.results
            result.dbDuration = execResult.meta.duration
        }
    )
    assertQueryResultSuccess(result, QueryOperation.READ_PRODUCT_BY_IDS)
    if (result.rows) {
        return result.rows.map(convertProduct)
    }
    return []
}

export async function createProductAndAccumulate(
    serviceContext: ServiceContext,
    product: Product,
    accumulations: Accumulation[]
) {
    const accOperations = accumulations.map(acc => QueryOperation.UPDATE_ACCUMULATION)
    const result = await executeBatchQuery(
        serviceContext, BatchQueryOperation.CREATE_PRODUCT_AND_ACCUMULATE,
        function (operation: QueryOperation, table: string, index: number): D1PreparedStatement {
            switch (operation) {
                case QueryOperation.CREATE_PRODUCT:
                    return serviceContext.env.DB.prepare(`
                        INSERT INTO ${table} (product_id, name, price)
                        VALUES (?, ?, ?)
                    `).bind(product.productId, product.name, product.price)

                case QueryOperation.UPDATE_ACCUMULATION:
                    const acc = accumulations[index - 1]
                    return serviceContext.env.DB.prepare(`
                        UPDATE ${table}
                        SET accumulation_value = ?
                        WHERE accumulation_id = ?
                    `)
                        .bind(
                            acc.accumulationValue, acc.accumulationId
                        )

                default:
                    throw new ServiceError(ServiceResultCode.UNSUPPORTED_OPERATION, `Unsupported operation: ${operation}`)
            }
        },
        QueryOperation.CREATE_PRODUCT,
        ...accOperations
    )
    assertQueryResultSuccess(result, BatchQueryOperation.CREATE_PRODUCT_AND_ACCUMULATE)
}

function convertProduct(row: ProductRow): Product {
    return {
        productId: row.product_id,
        name: row.name,
        price: row.price
    }
}