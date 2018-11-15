// Type definitions for knex 0.15
// Project: https://knexjs.org/
// Definitions by: My Self <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import events = require("events");

type Callback = Function;
type Client = Function;
type Value = string | number | boolean | Date | Array<string> | Array<number> | Array<Date> | Array<boolean> | Buffer | Knex.Raw;
type ValueMap = { [key: string]: Value | Knex.QueryBuilder };
type ColumnName = string | Knex.Raw | Knex.QueryBuilder | {[key: string]: string };
type TableName = string | Knex.Raw | Knex.QueryBuilder;
type Identifier = { [alias: string]: string };

interface Knex extends Knex.QueryInterface {
    (tableName?: TableName | Identifier): Knex.QueryBuilder;

    VERSION: string;
    __knex__: string;

    raw: Knex.RawBuilder;
    schema: Knex.SchemaBuilder;
    queryBuilder(): Knex.QueryBuilder;

    client: Client;
}

declare function Knex(config: Knex.Config): Knex;

declare namespace Knex {
    class Client extends events.EventEmitter {
        constructor(config: Config);
        config: Config;
        dialect: string;
        driverName: string;
    }

    interface QueryInterface {
        select: Select;
        as: As;
        columns: Select;
        column: Select;
        from: Table;
        into: Table;
        table: Table;
        distinct: Distinct;

        // Joins
        join: Join;
        joinRaw: JoinRaw;
        innerJoin: Join;
        leftJoin: Join;
        leftOuterJoin: Join;
        rightJoin: Join;
        rightOuterJoin: Join;
        outerJoin: Join;
        fullOuterJoin: Join;
        crossJoin: Join;

        // Withs
        with: With;
        withRaw: WithRaw;
        withSchema: WithSchema;
        withWrapped: WithWrapped;

        // Wheres
        where: Where;
        andWhere: Where;
        orWhere: Where;
        whereNot: Where;
        andWhereNot: Where;
        orWhereNot: Where;
        whereRaw: WhereRaw;
        orWhereRaw: WhereRaw;
        andWhereRaw: WhereRaw;
        whereWrapped: WhereWrapped;
        havingWrapped: WhereWrapped;
        whereExists: WhereExists;
        orWhereExists: WhereExists;
        whereNotExists: WhereExists;
        orWhereNotExists: WhereExists;
        whereIn: WhereIn;
        orWhereIn: WhereIn;
        whereNotIn: WhereIn;
        orWhereNotIn: WhereIn;
        whereNull: WhereNull;
        orWhereNull: WhereNull;
        whereNotNull: WhereNull;
        orWhereNotNull: WhereNull;
        whereBetween: WhereBetween;
        orWhereBetween: WhereBetween;
        andWhereBetween: WhereBetween;
        whereNotBetween: WhereBetween;
        orWhereNotBetween: WhereBetween;
        andWhereNotBetween: WhereBetween;

        // Group by
        groupBy: GroupBy;
        groupByRaw: RawQueryBuilder;

        // Order by
        orderBy: OrderBy;
        orderByRaw: RawQueryBuilder;

        // Union
        union: Union;
        unionAll(callback: QueryCallback): QueryBuilder;

        // Having
        having: Having;
        andHaving: Having;
        havingRaw: RawQueryBuilder;
        orHaving: Having;
        orHavingRaw: RawQueryBuilder;
        havingIn: HavingIn;

        // Clear
        clearSelect(): QueryBuilder;
        clearWhere(): QueryBuilder;

        // Paging
        offset(offset: number): QueryBuilder;
        limit(limit: number): QueryBuilder;

        // Aggregation
        count(columnName?: string): QueryBuilder;
        countDistinct(columnName?: string): QueryBuilder;
        min(columnName: string): QueryBuilder;
        max(columnName: string): QueryBuilder;
        sum(columnName: string): QueryBuilder;
        sumDistinct(columnName: string): QueryBuilder;
        avg(columnName: string): QueryBuilder;
        avgDistinct(columnName: string): QueryBuilder;
        increment(columnName: string, amount?: number): QueryBuilder;
        decrement(columnName: string, amount?: number): QueryBuilder;

        // Others
        first: Select;

        debug(enabled?: boolean): QueryBuilder;
        pluck(column: string): QueryBuilder;

        insert(data: any, returning?: string | string[]): QueryBuilder;
        modify(callback: QueryCallbackWithArgs, ...args: any[]): QueryBuilder;
        update(data: any, returning?: string | string[]): QueryBuilder;
        update(columnName: string, value: Value, returning?: string | string[]): QueryBuilder;
        returning(column: string | string[]): QueryBuilder;

        del(returning?: string | string[]): QueryBuilder;
        delete(returning?: string | string[]): QueryBuilder;
        truncate(): QueryBuilder;

        clone(): QueryBuilder;
    }

    interface As {
        (columnName: string): QueryBuilder;
    }

    interface Select extends ColumnNameQueryBuilder {
        (aliases: { [alias: string]: string }): QueryBuilder;
    }

    interface Table {
        (tableName: TableName | Identifier): QueryBuilder;
        (callback: Function): QueryBuilder;
        (raw: Raw): QueryBuilder;
    }

    interface Distinct extends ColumnNameQueryBuilder {
    }

    interface Join {
        (raw: Raw): QueryBuilder;
        (tableName: TableName | QueryCallback, clause: (this: JoinClause, join: JoinClause) => void): QueryBuilder;
        (tableName: TableName | QueryCallback, columns: { [key: string]: string | number | Raw }): QueryBuilder;
        (tableName: TableName | QueryCallback, raw: Raw): QueryBuilder;
        (tableName: TableName | QueryCallback, column1: string, column2: string): QueryBuilder;
        (tableName: TableName | QueryCallback, column1: string, raw: Raw): QueryBuilder;
        (tableName: TableName | QueryCallback, column1: string, operator: string, column2: string): QueryBuilder;
    }

    interface JoinClause {
        on(raw: Raw): JoinClause;
        on(callback: QueryCallback): JoinClause;
        on(columns: { [key: string]: string | Raw }): JoinClause;
        on(column1: string, column2: string): JoinClause;
        on(column1: string, raw: Raw): JoinClause;
        on(column1: string, operator: string, column2: string | Raw): JoinClause;
        andOn(raw: Raw): JoinClause;
        andOn(callback: QueryCallback): JoinClause;
        andOn(columns: { [key: string]: string | Raw }): JoinClause;
        andOn(column1: string, column2: string): JoinClause;
        andOn(column1: string, raw: Raw): JoinClause;
        andOn(column1: string, operator: string, column2: string | Raw): JoinClause;
        orOn(raw: Raw): JoinClause;
        orOn(callback: QueryCallback): JoinClause;
        orOn(columns: { [key: string]: string | Raw }): JoinClause;
        orOn(column1: string, column2: string): JoinClause;
        orOn(column1: string, raw: Raw): JoinClause;
        orOn(column1: string, operator: string, column2: string | Raw): JoinClause;
        onIn(column1: string, values: any[]): JoinClause;
        andOnIn(column1: string, values: any[]): JoinClause;
        orOnIn(column1: string, values: any[]): JoinClause;
        onNotIn(column1: string, values: any[]): JoinClause;
        andOnNotIn(column1: string, values: any[]): JoinClause;
        orOnNotIn(column1: string, values: any[]): JoinClause;
        onNull(column1: string): JoinClause;
        andOnNull(column1: string): JoinClause;
        orOnNull(column1: string): JoinClause;
        onNotNull(column1: string): JoinClause;
        andOnNotNull(column1: string): JoinClause;
        orOnNotNull(column1: string): JoinClause;
        onExists(callback: QueryCallback): JoinClause;
        andOnExists(callback: QueryCallback): JoinClause;
        orOnExists(callback: QueryCallback): JoinClause;
        onNotExists(callback: QueryCallback): JoinClause;
        andOnNotExists(callback: QueryCallback): JoinClause;
        orOnNotExists(callback: QueryCallback): JoinClause;
        onBetween(column1: string, range: [any, any]): JoinClause;
        andOnBetween(column1: string, range: [any, any]): JoinClause;
        orOnBetween(column1: string, range: [any, any]): JoinClause;
        onNotBetween(column1: string, range: [any, any]): JoinClause;
        andOnNotBetween(column1: string, range: [any, any]): JoinClause;
        orOnNotBetween(column1: string, range: [any, any]): JoinClause;
        using(column: string | string[] | Raw | { [key: string]: string | Raw }): JoinClause;
        type(type: string): JoinClause;
    }

    interface JoinRaw {
        (tableName: string, binding?: Value): QueryBuilder;
    }

    interface With extends WithRaw, WithWrapped {
    }

    interface WithRaw {
        (alias: string, raw: Raw): QueryBuilder;
        (alias: string, sql: string, bindings?: Value[] | Object): QueryBuilder;
    }

    interface WithSchema {
        (schema: string): QueryBuilder;
    }

    interface WithWrapped {
        (alias: string, callback: (queryBuilder: QueryBuilder) => any): QueryBuilder;
    }

    interface Where extends WhereRaw, WhereWrapped, WhereNull {
        (raw: Raw): QueryBuilder;
        (callback: QueryCallback): QueryBuilder;
        (object: Object): QueryBuilder;
        (columnName: string, value: Value | null): QueryBuilder;
        (columnName: string, operator: string, value: Value | QueryBuilder | null): QueryBuilder;
        (left: Raw, operator: string, right: Value | QueryBuilder | null): QueryBuilder;
    }

    interface WhereRaw extends RawQueryBuilder {
        (condition: boolean): QueryBuilder;
    }

    interface WhereWrapped {
        (callback: QueryCallback): QueryBuilder;
    }

    interface WhereNull {
        (columnName: string): QueryBuilder;
    }

    interface WhereBetween {
        (columnName: string, range: [Value, Value]): QueryBuilder;
    }

    interface WhereExists {
        (callback: QueryCallback): QueryBuilder;
        (query: QueryBuilder): QueryBuilder;
    }

    interface WhereNull {
        (columnName: string): QueryBuilder;
    }

    interface WhereIn {
        (columnName: string, values: Value[] | QueryBuilder | QueryCallback): QueryBuilder;
        (columnNames: string[], values: Value[][] | QueryBuilder | QueryCallback): QueryBuilder;
    }

    interface GroupBy extends RawQueryBuilder, ColumnNameQueryBuilder {
    }

    interface OrderBy {
        (columnName: string, direction?: string): QueryBuilder;
    }

    interface Union {
        (callback: QueryCallback | QueryBuilder | Raw, wrap?: boolean): QueryBuilder;
        (callbacks: (QueryCallback | QueryBuilder | Raw)[], wrap?: boolean): QueryBuilder;
        (...callbacks: (QueryCallback | QueryBuilder | Raw)[]): QueryBuilder;
        // (...callbacks: QueryCallback[], wrap?: boolean): QueryInterface;
    }

    interface Having extends RawQueryBuilder, WhereWrapped {
        (tableName: string, column1: string, operator: string, column2: string): QueryBuilder;
    }

    interface HavingIn {
        (columnName: string, values: Value[]): QueryBuilder;
    }

    // commons
    interface ColumnNameQueryBuilder {
        (...columnNames: ColumnName[]): QueryBuilder;
        (columnNames: ColumnName[]): QueryBuilder;
    }

    interface RawQueryBuilder {
        (sql: string, ...bindings: (Value | QueryBuilder)[]): QueryBuilder;
        (sql: string, bindings: (Value | QueryBuilder)[] | ValueMap): QueryBuilder;
        (raw: Raw): QueryBuilder;
    }

    // Raw
    interface Raw extends events.EventEmitter, ChainableInterface {
        wrap(before: string, after: string): Raw;
    }

    interface RawBuilder {
        (value: Value): Raw;
        (sql: string, ...bindings: (Value | QueryBuilder)[]): Raw;
        (sql: string, bindings: (Value | QueryBuilder)[] | ValueMap): Raw;
    }

    //
    // QueryBuilder
    //
    type QueryCallback = (this: QueryBuilder, builder: QueryBuilder) => void;
    type QueryCallbackWithArgs = (this: QueryBuilder, builder: QueryBuilder, ...args: any[]) => void;

    interface QueryBuilder extends QueryInterface, ChainableInterface {
        or: QueryBuilder;
        and: QueryBuilder;

        forUpdate(): QueryBuilder;
        forShare(): QueryBuilder;

        toSQL(): Sql;

        on(event: string, callback: Function): QueryBuilder;
    }

    interface Sql {
        method: string;
        options: any;
        bindings: Value[];
        sql: string;
    }

    //
    // Chainable interface
    //
    interface ChainableInterface {
        toQuery(): string;
        options(options: any): QueryBuilder;
    }

    interface SchemaBuilder {
        createTable(tableName: string, callback: (tableBuilder: CreateTableBuilder) => any): SchemaBuilder;
        createTableIfNotExists(tableName: string, callback: (tableBuilder: CreateTableBuilder) => any): SchemaBuilder;
        alterTable(tableName: string, callback: (tableBuilder: CreateTableBuilder) => any): SchemaBuilder;
        renameTable(oldTableName: string, newTableName: string): any;
        dropTable(tableName: string): SchemaBuilder;
        hasTable(tableName: string): any;
        hasColumn(tableName: string, columnName: string): any;
        table(tableName: string, callback: (tableBuilder: AlterTableBuilder) => any): any;
        dropTableIfExists(tableName: string): SchemaBuilder;
        raw(statement: string): SchemaBuilder;
        withSchema(schemaName: string): SchemaBuilder;
    }

    interface TableBuilder {
        increments(columnName?: string): ColumnBuilder;
        bigIncrements(columnName?: string): ColumnBuilder;
        dropColumn(columnName: string): TableBuilder;
        dropColumns(...columnNames: string[]): TableBuilder;
        renameColumn(from: string, to: string): ColumnBuilder;
        integer(columnName: string): ColumnBuilder;
        bigInteger(columnName: string): ColumnBuilder;
        text(columnName: string, textType?: string): ColumnBuilder;
        string(columnName: string, length?: number): ColumnBuilder;
        float(columnName: string, precision?: number, scale?: number): ColumnBuilder;
        decimal(columnName: string, precision?: number | null, scale?: number): ColumnBuilder;
        boolean(columnName: string): ColumnBuilder;
        date(columnName: string): ColumnBuilder;
        dateTime(columnName: string): ColumnBuilder;
        time(columnName: string): ColumnBuilder;
        timestamp(columnName: string, standard?: boolean): ColumnBuilder;
        timestamps(useTimestampType?: boolean, makeDefaultNow?: boolean): ColumnBuilder;
        binary(columnName: string, length?: number): ColumnBuilder;
        enum(columnName: string, values: Value[]): ColumnBuilder;
        enu(columnName: string, values: Value[]): ColumnBuilder;
        json(columnName: string): ColumnBuilder;
        jsonb(columnName: string): ColumnBuilder;
        uuid(columnName: string): ColumnBuilder;
        comment(val: string): TableBuilder;
        specificType(columnName: string, type: string): ColumnBuilder;
        primary(columnNames: string[]): TableBuilder;
        index(columnNames: (string | Raw)[], indexName?: string, indexType?: string): TableBuilder;
        unique(columnNames: (string | Raw)[], indexName?: string): TableBuilder;
        foreign(column: string, foreignKeyName?: string): ForeignConstraintBuilder;
        foreign(columns: string[], foreignKeyName?: string): MultikeyForeignConstraintBuilder;
        dropForeign(columnNames: string[], foreignKeyName?: string): TableBuilder;
        dropUnique(columnNames: (string | Raw)[], indexName?: string): TableBuilder;
        dropPrimary(constraintName?: string): TableBuilder;
        dropIndex(columnNames: (string | Raw)[], indexName?: string): TableBuilder;
        dropTimestamps(): ColumnBuilder;
    }

    interface CreateTableBuilder extends TableBuilder {
    }

    interface MySqlTableBuilder extends CreateTableBuilder {
        engine(val: string): CreateTableBuilder;
        charset(val: string): CreateTableBuilder;
        collate(val: string): CreateTableBuilder;
    }

    interface AlterTableBuilder extends TableBuilder {
    }

    interface MySqlAlterTableBuilder extends AlterTableBuilder {
    }

    interface ColumnBuilder {
        index(indexName?: string): ColumnBuilder;
        primary(constraintName?: string): ColumnBuilder;
        unique(indexName?: string): ColumnBuilder;
        references(columnName: string): ReferencingColumnBuilder;
        onDelete(command: string): ColumnBuilder;
        onUpdate(command: string): ColumnBuilder;
        defaultTo(value: Value): ColumnBuilder;
        unsigned(): ColumnBuilder;
        notNullable(): ColumnBuilder;
        nullable(): ColumnBuilder;
        comment(value: string): ColumnBuilder;
        alter(): ColumnBuilder;
    }

    interface ForeignConstraintBuilder {
        references(columnName: string): ReferencingColumnBuilder;
    }

    interface MultikeyForeignConstraintBuilder {
        references(columnNames: string[]): ReferencingColumnBuilder;
    }

    interface PostgreSqlColumnBuilder extends ColumnBuilder {
        index(indexName?: string, indexType?: string): ColumnBuilder;
    }

    interface ReferencingColumnBuilder extends ColumnBuilder {
        inTable(tableName: string): ColumnBuilder;
    }

    interface AlterColumnBuilder extends ColumnBuilder {
    }

    interface MySqlAlterColumnBuilder extends AlterColumnBuilder {
        first(): AlterColumnBuilder;
        after(columnName: string): AlterColumnBuilder;
    }

    interface Config {
        debug?: boolean;
        client?: string | typeof Client;
        dialect?: string;
        version?: string;
        acquireConnectionTimeout?: number;
        useNullAsDefault?: boolean;
        searchPath?: string | string[];
    }
}

export = Knex;

