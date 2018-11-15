"use strict";
/*
*    FN  : makeTableQuery.ts
*    C   : 2018년 9월 21일 13:19:05 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
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
const is_1 = __importDefault(require("@sindresorhus/is"));
const index_1 = require("./index");
const checkObject_1 = __importDefault(require("checkObject"));
const json_stringify_extended_1 = __importDefault(require("json-stringify-extended"));
const Sql = __importStar(require("./../sql"));
function makeTableQuery(schema, table, options) {
    // @ts-ignore
    options = checkObject_1.default(options || {}, {
        useDefaultPrimary: [/usedefaultprimary/, true, 'boolean'],
        useTimeStamps: [/use(timestamp(s)?|updateat|createat)/, true, 'boolean'],
        useZombodbIndex: [/usezombodb(index)?/, false, 'boolean'],
        zombodbIndexFunc: [/zombodbindexfunc(tion)?/, undefined, 'string']
    });
    var additionalQuery = [], zombodbFields = [], useTimeStamps = options.useTimeStamps, useDefaultPrimary = options.useDefaultPrimary, useZombodbIndex = options.useZombodbIndex, zombodbIndexFunc = options.zombodbIndexFunc;
    Object.keys(schema || {}).forEach((fieldKey) => {
        var fieldInfo = schema[fieldKey];
        if (!is_1.default.plainObject(fieldInfo)) {
            switch (fieldKey) {
                case 'timestamps':
                    if (fieldInfo === false)
                        useTimeStamps = false;
                    break;
            }
            return;
        }
        var fieldType = fieldInfo.type, fieldArgs = [fieldKey], target = table, fieldComment;
        if (is_1.default.array(fieldType)) {
            fieldArgs = fieldArgs.concat(fieldType.slice(1));
            fieldType = fieldType[0];
        }
        if (index_1.Regexp.varchar.test(fieldType)) {
            fieldArgs = fieldArgs.concat(index_1.Regexp.varchar.exec(fieldType).slice(1, 2));
            fieldType = 'string';
        }
        switch (fieldType.split('.')[0]) {
            case 'int4':
                fieldType = 'interger';
                break;
            case 'bigint':
            case 'int8':
                fieldType = 'bigInteger';
                break;
            case 'varchar':
                fieldType = 'string';
                break;
            case 'real':
                fieldType = 'float';
                break;
            case 'timestampz':
                fieldType = 'timestamp';
                break;
        }
        if (is_1.default.function_(target[fieldType])) {
            target = target[fieldType].apply(target, fieldArgs);
        }
        else {
            target = target.specificType(fieldKey, fieldType);
        }
        for (var prop in fieldInfo) {
            var funcArgs = fieldInfo[prop];
            switch (prop) {
                case 'check':
                    if (is_1.default.nonEmptyString(funcArgs)) {
                        additionalQuery.push(`
                            alter table "${table._schemaName || 'public'}"."${table._tableName}" add check ${funcArgs};
                        `);
                    }
                    prop = null;
                    break;
                case 'unique':
                case 'isUnique':
                    if (funcArgs) {
                        if (funcArgs === true)
                            funcArgs = [];
                        prop = 'unique';
                    }
                    else
                        prop = null;
                    break;
                case 'index':
                case 'isIndex':
                    if (funcArgs) {
                        if (funcArgs === true)
                            funcArgs = [];
                        prop = 'index';
                    }
                    else
                        prop = null;
                    break;
                case 'primary':
                case 'isPrimary':
                case 'primaryKey':
                    if (funcArgs) {
                        if (funcArgs === true)
                            funcArgs = [];
                        prop = 'primary';
                        useDefaultPrimary = false;
                    }
                    else
                        prop = null;
                    break;
                case 'notNull':
                    if (funcArgs) {
                        if (funcArgs === true)
                            funcArgs = [];
                        prop = 'notNullable';
                    }
                    else
                        prop = null;
                    break;
                case 'null':
                case 'isNull':
                    if (funcArgs) {
                        if (funcArgs === true)
                            funcArgs = [];
                        prop = 'nullable';
                    }
                    else
                        prop = null;
                    break;
                case 'default':
                    if (funcArgs) {
                        prop = 'defaultTo';
                    }
                    else
                        prop = null;
                    break;
                case 'type':
                    prop = null;
                    break;
                case 'comment':
                    if (is_1.default.nonEmptyString(funcArgs)) {
                        fieldComment = funcArgs;
                    }
                    prop = null;
                    break;
            }
            if (is_1.default.function_(target[prop])) {
                if (!is_1.default.array(funcArgs)) {
                    if (funcArgs)
                        funcArgs = [funcArgs];
                    else
                        funcArgs = [];
                }
                target = target[prop].apply(target, funcArgs);
            }
        }
        if (fieldComment) {
            target.comment(json_stringify_extended_1.default([
                fieldComment,
                fieldInfo
            ]));
        }
        if (useZombodbIndex) {
            if (!fieldInfo[Sql.zombo.excludeOptionName])
                return;
            if (Sql.zombo.excludeType.indexOf(fieldType) !== -1)
                return;
            if (Sql.zombo.excludeName.indexOf(fieldKey) !== -1)
                return;
            zombodbFields.push({
                type: fieldType,
                key: fieldKey
            });
        }
    });
    if (useTimeStamps) {
        table.timestamp('created_at').defaultTo('now()');
        table.timestamp('updated_at').defaultTo('now()');
        additionalQuery.push(Sql.time.applyAutoUpdateFunc(table._schemaName));
        additionalQuery.push(`
            CREATE TRIGGER  "${table._tableName}_updated_at"
            BEFORE UPDATE 
            ON "${table._schemaName || 'public'}"."${table._tableName}"
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
        `);
    }
    if (useDefaultPrimary) {
        table.increments('_tid').primary();
    }
    if (useZombodbIndex) {
        additionalQuery.push(Sql.zombo.indexing(table._schemaName, table._tableName, zombodbIndexFunc || zombodbFields));
    }
    return additionalQuery;
}
exports.default = makeTableQuery;
