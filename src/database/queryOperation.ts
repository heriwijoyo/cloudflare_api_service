import { Table } from "./table";

export enum QueryOperation {
    CREATE_USER = 'CREATE_USER',
    READ_USER = 'READ_USER',
    UPDATE_USER = 'UPDATE_USER',
    DELETE_USER = 'DELETE_USER',
    CREATE_PRODUCT = 'CREATE_PRODUCT',
    READ_PRODUCT = 'READ_PRODUCT',
    READ_PRODUCT_BY_IDS = 'READ_PRODUCT_BY_IDS',
    UPDATE_PRODUCT = 'UPDATE_PRODUCT',
    DELETE_PRODUCT = 'DELETE_PRODUCT',
    CREATE_ORDER = 'CREATE_ORDER',
    READ_ORDER = 'READ_ORDER',
    UPDATE_ORDER = 'UPDATE_ORDER',
    DELETE_ORDER = 'DELETE_ORDER',
    CREATE_ORDER_ITEM = 'CREATE_ORDER_ITEM',
    READ_ORDER_ITEM = 'READ_ORDER_ITEM',
    UPDATE_ORDER_ITEM = 'UPDATE_ORDER_ITEM',
    DELETE_ORDER_ITEM = 'DELETE_ORDER_ITEM',
    CREATE_COUNTER = 'CREATE_COUNTER',
    READ_COUNTER = 'READ_COUNTER',
    UPDATE_COUNTER = 'UPDATE_COUNTER',
    DELETE_COUNTER = 'DELETE_COUNTER',
    CREATE_BIZ_ACCUMULATION = 'CREATE_BIZ_ACCUMULATION',
    READ_BIZ_ACCUMULATION = 'READ_BIZ_ACCUMULATION',
    UPDATE_BIZ_ACCUMULATION = 'UPDATE_BIZ_ACCUMULATION',
    DELETE_BIZ_ACCUMULATION = 'DELETE_BIZ_ACCUMULATION',
}

export function getTable(operation: QueryOperation): Table {
    switch (operation) {
        case QueryOperation.CREATE_USER:
            return Table.USERS;
        case QueryOperation.READ_USER:
            return Table.USERS;
        case QueryOperation.UPDATE_USER:
            return Table.USERS;
        case QueryOperation.DELETE_USER:
            return Table.USERS;
        case QueryOperation.CREATE_PRODUCT:
            return Table.PRODUCTS;
        case QueryOperation.READ_PRODUCT:
            return Table.PRODUCTS;
        case QueryOperation.UPDATE_PRODUCT:
            return Table.PRODUCTS;
        case QueryOperation.DELETE_PRODUCT:
            return Table.PRODUCTS;
        case QueryOperation.CREATE_ORDER:
            return Table.ORDERS;
        case QueryOperation.READ_ORDER:
            return Table.ORDERS;
        case QueryOperation.UPDATE_ORDER:
            return Table.ORDERS;
        case QueryOperation.DELETE_ORDER:
            return Table.ORDERS;
        case QueryOperation.CREATE_ORDER_ITEM:
            return Table.ORDER_ITEMS;
        case QueryOperation.READ_ORDER_ITEM:
            return Table.ORDER_ITEMS;
        case QueryOperation.UPDATE_ORDER_ITEM:
            return Table.ORDER_ITEMS;
        case QueryOperation.DELETE_ORDER_ITEM:
            return Table.ORDER_ITEMS;
        case QueryOperation.CREATE_COUNTER:
            return Table.COUNTERS;
        case QueryOperation.READ_COUNTER:
            return Table.COUNTERS;
        case QueryOperation.UPDATE_COUNTER:
            return Table.COUNTERS;
        case QueryOperation.DELETE_COUNTER:
            return Table.COUNTERS;
        case QueryOperation.CREATE_BIZ_ACCUMULATION:
            return Table.BIZ_ACCUMULATION;
        case QueryOperation.READ_BIZ_ACCUMULATION:
            return Table.BIZ_ACCUMULATION;
        case QueryOperation.UPDATE_BIZ_ACCUMULATION:
            return Table.BIZ_ACCUMULATION;
        case QueryOperation.DELETE_BIZ_ACCUMULATION:
            return Table.BIZ_ACCUMULATION;
        default:
            throw new Error("Invalid query operation");
    }
}

export enum BatchQueryOperation {
    CREATE_ORDER = 'CREATE_ORDER',
    LIMIT_CHECK_AND_ACCUMULATE = 'LIMIT_CHECK_AND_ACCUMULATE'
}