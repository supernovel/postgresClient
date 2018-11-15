/*
*    FN  : index.ts
*    C   : 2018년 9월 21일 13:16:14 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/

import Postgres = require('pg');
import PostgresQueryStream = require('pg-query-stream');
import JSONStream = require('JSONStream');
import Stream = require('stream');

import makeTableQuery from './makeTableQuery';
import { analyzerTableSchema, checkSchema } from './analyzerSchema';

export const Regexp = {
    varchar: /varchar\((\d+)\)/,
    columnType: /(.*)\((.*)\)/
};

export interface SimpleQueryOption extends Postgres.ConnectionConfig{
    useStream?: boolean
}

export default class PostgresStatic{
    constructor(){};

    static defaultNode: object
    static async getDefaultNode(options: Postgres.ConnectionConfig, remainNode: boolean){
        options = options || {};

        if(options.host && !PostgresStatic.defaultNode[options.host]){
            var client = new Postgres.Client({
                    user: options.user,
                    host: options.host,
                    database: 'postgres',
                    password: options.password
                }),
                response = await client.connect();

            if(remainNode){
                process.on('exit', (code) => {
                    client.end();
                });

                PostgresStatic.defaultNode[options.host] = client;
            }

            return client;
        }

        return PostgresStatic.defaultNode[options.host];
    }

    static async makeDatabase(options: any, remainNode:boolean){
        var defaultNode = await PostgresStatic.getDefaultNode(options, remainNode);

        await defaultNode.query(['create database "', this.name,'"'].join(''));

        if(!remainNode){
            defaultNode.end();
        }
    }

    static async query(query: string, options: SimpleQueryOption): Promise<Postgres.QueryResult|Stream>{
        var client = new Postgres.Client(options),
            response;

        if(options.stream){
            let streamQuery = new PostgresQueryStream(query),
                stream = client.query(streamQuery),
                output = new Stream.PassThrough();

            stream.pipe(JSONStream.stringify(false)).pipe(output);

            response = output;
        }else response = await client.query(query);

        return response;
    }

    static makeTableQuery = makeTableQuery
    static analyzerTableSchema = analyzerTableSchema
    static checkSchema = checkSchema
}
