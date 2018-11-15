"use strict";
/*
*    FN  : table.ts
*    C   : 2018년 9월 3일 15:15:15 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/
Object.defineProperty(exports, "__esModule", { value: true });
function getColumns(schemaName, tableName) {
    return `
        SELECT
            a.attname AS "field",
            t.typname || '(' || a.atttypmod || ')' AS "type",
            CASE WHEN a.attnotnull = 't' THEN 'YES' ELSE 'NO' END AS "isNull",
            CASE WHEN r.contype = 'p' THEN 'PRI' ELSE '' END AS "key",
            (SELECT substring(pg_catalog.pg_get_expr(d.adbin, d.adrelid) for 128)
                FROM
                    pg_catalog.pg_attrdef d
                WHERE
                    d.adrelid = a.attrelid
                    AND d.adnum = a.attnum
                    AND a.atthasdef) AS "Default",
            '' as "extras",
            (SELECT col_description(a.attrelid, a.attnum)) AS "comment"
        FROM
            pg_class c 
            JOIN pg_attribute a ON a.attrelid = c.oid
            JOIN pg_type t ON a.atttypid = t.oid
            LEFT JOIN pg_catalog.pg_constraint r ON c.oid = r.conrelid 
                AND r.conname = a.attname
            LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE
            n.nspname = '${schemaName}'
            AND c.relname = '${tableName}'
            AND a.attnum > 0
        ORDER BY a.attnum
    `;
}
exports.getColumns = getColumns;
function getTable(schemaName, tableName) {
    return `
        SELECT 
            pg_class.relname as "tableName", 
            pg_class.relkind as "tableType", 
            pg_namespace.nspname as "schemaName"
        FROM pg_class
        JOIN pg_namespace on pg_class.relnamespace = pg_namespace.oid
        WHERE
            pg_class.relname = '${tableName}'
            AND pg_class.relkind not in ('i', 'S')
            AND pg_namespace.nspname = '${schemaName}'
    `;
}
exports.getTable = getTable;
