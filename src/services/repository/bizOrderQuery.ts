import { BatchQueryOperation, QueryOperation } from "../../database/queryOperation";
import { composeDefaultStatement, executeBatchQuery } from "../../database/queryTemplates";
import { Order } from "../model/bizModel";
import { ServiceContext } from "../serviceBaseModels";

export async function createOrder(
    serviceContext: ServiceContext,
    order: Order
) {
    const itemOperations: QueryOperation[] = order.orderItems.map(() => QueryOperation.CREATE_ORDER_ITEM)
    const result = await executeBatchQuery(
        serviceContext, BatchQueryOperation.CREATE_ORDER,
        function (operation: QueryOperation, table: string, index: number): D1PreparedStatement {
            switch (operation) {
                case QueryOperation.CREATE_ORDER:
                    return serviceContext.env.DB
                        .prepare(`
                            INSERT INTO ${table}
                            (order_id, user_id, order_date, total_items, total_amount)
                            VALUES (?, ?, ?, ?, ?)
                        `)
                        .bind(order.orderId, order.userId, order.orderDate, order.totalItems, order.totalAmount)

                case QueryOperation.CREATE_ORDER_ITEM:
                    // index - 1 because the first operation is CREATE_ORDER
                    const item = order.orderItems[index - 1]
                    return serviceContext.env.DB
                        .prepare(`
                            INSERT INTO ${table}
                            (order_item_id, order_id, product_id, quantity, price)
                            VALUES (?, ?, ?, ?, ?)
                        `)
                        .bind(item.orderItemId, item.orderId, item.productId, item.quantity, item.price)

                default:
                    return composeDefaultStatement(serviceContext.env.DB)
            }
        },
        QueryOperation.CREATE_ORDER,
        ...itemOperations
    )
}