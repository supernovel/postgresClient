"use strict";
/*
*    FN  : index.ts
*    C   : 2018년 9월 21일 13:16:14 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Postgres = require("pg");
const PostgresQueryStream = require("pg-query-stream");
const JSONStream = require("JSONStream");
const Stream = require("stream");
const makeTableQuery_1 = __importDefault(require("./makeTableQuery"));
const analyzerSchema_1 = require("./analyzerSchema");
exports.Regexp = {
    varchar: /varchar\((\d+)\)/,
    columnType: /(.*)\((.*)\)/
};
class PostgresStatic {
    constructor() { }
    ;
    static async getDefaultNode(options, remainNode) {
        options = options || {};
        if (options.host && !PostgresStatic.defaultNode[options.host]) {
            var client = new Postgres.Client({
                user: options.user,
                host: options.host,
                database: 'postgres',
                password: options.password
            }), response = await client.connect();
            if (remainNode) {
                process.on('exit', (code) => {
                    client.end();
                });
                PostgresStatic.defaultNode[options.host] = client;
            }
            return client;
        }
        return PostgresStatic.defaultNode[options.host];
    }
    static async makeDatabase(options, remainNode) {
        var defaultNode = await PostgresStatic.getDefaultNode(options, remainNode);
        await defaultNode.query(['create database "', this.name, '"'].join(''));
        if (!remainNode) {
            defaultNode.end();
        }
    }
    static async query(query, options) {
        var client = new Postgres.Client(options), response;
        if (options.stream) {
            let streamQuery = new PostgresQueryStream(query), stream = client.query(streamQuery), output = new Stream.PassThrough();
            stream.pipe(JSONStream.stringify(false)).pipe(output);
            response = output;
        }
        else
            response = await client.query(query);
        return response;
    }
}
PostgresStatic.makeTableQuery = makeTableQuery_1.default;
PostgresStatic.analyzerTableSchema = analyzerSchema_1.analyzerTableSchema;
PostgresStatic.checkSchema = analyzerSchema_1.checkSchema;
exports.default = PostgresStatic;
