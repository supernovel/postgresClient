"use strict";
/*
    FN  : PostgresClient.js
    C   : 작성 날짜 미작성
    DS  :
    N   :
    A   : supernovel(supernovel@gmail.com)
    L   : 이 모듈의 모든 권한은 다음 작성자에게 귀속됩니다.
            supernovel(supernovel@gmail.com)
            Mk(barmherzig@mkpowered.pro)
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Debugger = require("debug");
const Postgres = require("pg");
const PostgresQueryStream = require("pg-query-stream");
const Knex = require("knex");
const MoSqlBuiler = require("mongo-sql");
const Stream = require("stream");
const JSONStream = require("JSONStream");
const static_1 = __importDefault(require("./static"));
const table_1 = __importDefault(require("./table"));
const Sql = __importStar(require("./sql"));
const PostgresExtension = __importStar(require("./extension"));
const config_1 = require("./config");
const is_1 = __importDefault(require("@sindresorhus/is"));
const lodash_1 = require("lodash");
const checkObject_1 = __importDefault(require("checkObject"));
const Debug = Debugger('postgres'), SqlBuilder = Knex({
    dialect: 'postgres'
}), DefaultQueryTimeout = 5000;
class PostgresClient extends static_1.default {
    constructor(options) {
        super();
        this.models = {};
        this.config = checkObject_1.default(options, config_1.PostgresConfigSchema);
    }
    get builder() {
        return SqlBuilder;
    }
    get moBuilder() {
        return MoSqlBuiler;
    }
    async connect() {
        if (this.node) {
            try {
                await this.node.query('SELECT NOW()');
                return;
            }
            catch (error) {
                delete this.node;
            }
        }
        let node = new Postgres.Pool(this.config);
        try {
            await node.query('SELECT NOW()');
            this.node = node;
        }
        catch (error) {
            if (error.code === '3D000') {
                await static_1.default.makeDatabase(this.config, true);
                await node.query('SELECT NOW()');
                this.node = node;
            }
            else
                throw error;
        }
        process.on('exit', (code) => {
            if (this.node)
                this.node.end();
        });
        await PostgresExtension.initialize(this, this.config.extensions);
    }
    async getTable(name, schema) {
        if (!this.models[name]) {
            let splitName = name.split('.'), schemaName = 'public', tableName = name, records;
            switch (splitName.length) {
                case 2:
                    schemaName = splitName[0];
                    tableName = splitName[1];
                    break;
            }
            try {
                records = (await (this.models[name] = this.query(Sql.table.getTable(schemaName, tableName)))).rows;
            }
            catch (error) {
                delete this.models[name];
                throw error;
            }
            if (!records.length) {
                if (is_1.default.plainObject(schema)) {
                    schema.tableName = tableName;
                    schema.schemaName = schemaName;
                    await this.creataTableToJson(schema);
                    this.models[name] = lodash_1.assignIn({}, schema);
                }
                else
                    throw new Error('올바르지 않은 스키마입니다.');
            }
            else {
                delete this.models[name];
                this.models[name] = await this.getTableSchema(schemaName, tableName);
            }
        }
        else if (is_1.default.promise(this.models[name]))
            return this.models[name];
        return new table_1.default(name, this, this.models[name]);
    }
    async creataTableToJson(schema) {
        let tableName = schema.tableName, schemaName = schema.schemaName || 'public';
        if (!is_1.default.nonEmptyString(tableName)) {
            throw Error('올바르지 않은 테이블 이름입니다.');
        }
        let additionalQuery, createTable_SqlString = this.builder.schema.withSchema(schemaName).createTable(tableName, function (table) {
            additionalQuery = static_1.default.makeTableQuery(schema, table);
        }).toString();
        await this.query([createTable_SqlString, additionalQuery.join('')].join(';'));
    }
    async getTableSchema(schemaName, tableName) {
        if (this.models[`${schemaName}.${tableName}`]) {
            return this.models[`${schemaName}.${tableName}`];
        }
        else {
            let records = (await this.query(Sql.table.getColumns(schemaName, tableName))).rows;
            if (!records.length) {
                throw new Error('테이블 스키마 확인 쿼리 오류입니다.');
            }
            else {
                // Todo. Convert from Array Schema 
                let schema = static_1.default.analyzerTableSchema(records);
                schema['tableName'] = tableName;
                schema['schemaName'] = schemaName;
                return schema;
            }
        }
    }
    async query(query, values, options) {
        options = options || {};
        if (is_1.default.plainObject(values) && arguments.length == 2) {
            options = values;
            values = null;
        }
        let isReleased = false;
        const client = await this.node.connect(), result = await new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                const error = new Error('제한시간을 초과했습니다.');
                reject(error);
                if (!isReleased) {
                    client.release(error);
                    isReleased = true;
                }
            }, options.timeout || DefaultQueryTimeout);
            this.node.query(query, values, (error, result) => {
                if (timer)
                    clearTimeout(timer);
                if (!isReleased) {
                    client.release();
                    isReleased = true;
                }
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
        return result;
    }
    async stream(query, values, options) {
        options = options || {};
        if (is_1.default.plainObject(values) && arguments.length == 2) {
            options = values;
            values = null;
        }
        const client = await this.node.connect(), streamQuery = new PostgresQueryStream(query, values), stream = client.query(streamQuery), output = new Stream.PassThrough();
        let isReleased = false;
        let timer = setTimeout(() => {
            const error = new Error('제한시간을 초과했습니다.');
            output.emit('error', error);
            if (!isReleased) {
                client.release(error);
                isReleased = true;
            }
            stream.destroy();
        }, options.timeout || DefaultQueryTimeout);
        stream.on('end', () => {
            if (timer)
                clearTimeout(timer);
            if (!isReleased) {
                client.release();
                isReleased = true;
            }
        });
        stream.pipe(JSONStream.stringify(false)).pipe(output);
        return output;
    }
}
exports.default = PostgresClient;
