import { Table } from "./table";

export enum QueryOperation {
    READ_PRODUCT_BY_IDS = 'READ_PRODUCT_BY_IDS',
    CREATE_ORDER = 'CREATE_ORDER',
    CREATE_ORDER_ITEM = 'CREATE_ORDER_ITEM',
    CREATE_QUEUE_MAIL_SEND = 'CREATE_QUEUE_MAIL_SEND',
    READ_QUEUE_MAIL_SEND_PRIORITIZED = 'READ_QUEUE_MAIL_SEND_PRIORITIZED',
    UPDATE_QUEUE_MAIL_SEND_STATUS_AND_RETRY_COUNT = 'UPDATE_QUEUE_MAIL_SEND_STATUS_AND_RETRY_COUNT'
}

export function getTable(operation: QueryOperation): Table {
    switch (operation) {
        case QueryOperation.READ_PRODUCT_BY_IDS:
            return Table.PRODUCTS

        case QueryOperation.CREATE_ORDER:
            return Table.ORDERS

        case QueryOperation.CREATE_ORDER_ITEM:
            return Table.ORDER_ITEMS

        case QueryOperation.CREATE_QUEUE_MAIL_SEND:
        case QueryOperation.READ_QUEUE_MAIL_SEND_PRIORITIZED:
        case QueryOperation.UPDATE_QUEUE_MAIL_SEND_STATUS_AND_RETRY_COUNT:
            return Table.QUEUE_MAIL_SEND
    }
}

export enum BatchQueryOperation {
    CREATE_ORDER = 'CREATE_ORDER',
    CREATE_QUEUE_MAIL_SEND = 'CREATE_QUEUE_MAIL_SEND',
    LIMIT_CHECK_AND_ACCUMULATE = 'LIMIT_CHECK_AND_ACCUMULATE'
}