import { Table } from "./table";

export enum QueryOperation {
    READ_PRODUCT_BY_IDS = 'READ_PRODUCT_BY_IDS',
    CREATE_ORDER = 'CREATE_ORDER',
    CREATE_ORDER_ITEM = 'CREATE_ORDER_ITEM',
    CREATE_QUEUE_MAIL_SEND = 'CREATE_QUEUE_MAIL_SEND',
    READ_QUEUE_MAIL_SEND_PRIORITIZED = 'READ_QUEUE_MAIL_SEND_PRIORITIZED'
}

export function getTable(operation: QueryOperation): Table {
    switch (operation) {
        case QueryOperation.CREATE_ORDER:
            return Table.ORDERS;
        case QueryOperation.CREATE_QUEUE_MAIL_SEND:
            return Table.QUEUE_MAIL_SEND;
        default:
            throw new Error("Invalid query operation");
    }
}

export enum BatchQueryOperation {
    CREATE_ORDER = 'CREATE_ORDER',
    CREATE_QUEUE_MAIL_SEND = 'CREATE_QUEUE_MAIL_SEND',
    LIMIT_CHECK_AND_ACCUMULATE = 'LIMIT_CHECK_AND_ACCUMULATE'
}