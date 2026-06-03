import { QueryOperation } from "../../database/queryOperation"
import { executeSingleQuery, QueryResult } from "../../database/queryTemplates"
import { ServiceContext } from "../serviceBaseModels"
import { Product } from "../model/bizModel"

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
    if (result.rows) {
        return result.rows.map(convertProduct)
    }
    return []
}

function convertProduct(row: ProductRow): Product {
    return {
        productId: row.product_id,
        name: row.name,
        price: row.price
    }
}