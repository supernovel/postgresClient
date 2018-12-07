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

import Debugger = require('debug');

import Postgres = require('pg');
import PostgresQueryStream = require('pg-query-stream');
import Knex = require('knex');
import MoSqlBuiler = require('mongo-sql');
import Stream = require('stream');
import JSONStream = require('JSONStream');

import PostgresStatic from '@/static';
import PostgresTable from '@/table';
import * as Sql from '@/sql';
import * as PostgresExtension from '@/extension';
import { PostgresConfigSchema } from '@/config';

import is from '@sindresorhus/is';
import { assignIn } from 'lodash';

import checkOptions from 'checkObject';

const 
    Debug = Debugger('postgres'),
    SqlBuilder = Knex({
        dialect: 'postgres'
    }),
    DefaultQueryTimeout = 5000;

export interface PostgresConfig extends Postgres.PoolConfig {
    extensions?: Array<string>
}

export interface PostgresQueryOptions {
    timeout?: number
}

export default class PostgresClient extends PostgresStatic {
    constructor(options?: PostgresConfig){
        super();
        this.config = checkOptions(
            options, 
            PostgresConfigSchema
        );
    }

    config: PostgresConfig

    node: Postgres.Pool
    models: object = {}

    get builder(){
        return SqlBuilder;
    }

    get moBuilder(){
        return MoSqlBuiler;
    }

    async connect():Promise<void>{
        if(this.node){
            try{
                await this.node.query('SELECT NOW()');

                return;
            } catch (error) {
                delete this.node;
            }
        }

        let node = new Postgres.Pool(this.config);

        try {
            await node.query('SELECT NOW()');

            this.node = node;
        } catch(error) {
            if(error.code === '3D000'){
                await PostgresStatic.makeDatabase(this.config, true);
                await node.query('SELECT NOW()');

                this.node = node;
            }else throw error;
        }

        process.on('exit', (code) => {
            if(this.node) this.node.end();
        });

        await PostgresExtension.initialize(
            this, 
            this.config.extensions
        );
    }

    async getTable(name:string, schema?: any): Promise<PostgresTable>{
        if(!this.models[name]){
            let splitName = name.split('.'),
                schemaName = 'public',    
                tableName = name,
                records;
            
            switch(splitName.length){
                case 2:
                    schemaName = splitName[0];
                    tableName = splitName[1];
                    break;
            }

            try {
                records = (await (this.models[name] = this.query(
                    Sql.table.getTable(schemaName, tableName)
                ))).rows;
            } catch (error) {
                delete this.models[name];
                throw error;
            }

            if(!records.length){
                if(is.plainObject(schema)){
                    schema.tableName = tableName;
                    schema.schemaName = schemaName;

                    await this.creataTableToJson(schema);
                    
                    this.models[name] = assignIn({}, schema);  
                }else throw new Error('올바르지 않은 스키마입니다.');
            }else{
                delete this.models[name];

                this.models[name] = await this.getTableSchema(schemaName, tableName);
            }
        }else if(is.promise(this.models[name])) return this.models[name];

        return new PostgresTable(name, this, this.models[name]);
    }

    async creataTableToJson(schema: any){
        let tableName = schema.tableName,
            schemaName = schema.schemaName || 'public';

        if(!is.nonEmptyString(tableName)){
            throw Error('올바르지 않은 테이블 이름입니다.');
        }

        let additionalQuery,
            createTable_SqlString = 
            this.builder.schema.withSchema(schemaName).createTable(tableName, function(table){
                additionalQuery = PostgresStatic.makeTableQuery(schema, table);
            }).toString();

        await this.query([createTable_SqlString, additionalQuery.join('')].join(';'));
    }

    async getTableSchema(schemaName: string, tableName: string){
        if(this.models[`${schemaName}.${tableName}`]){
            return this.models[`${schemaName}.${tableName}`];
        }else{
            let records = (await this.query(
                Sql.table.getColumns(schemaName, tableName)
            )).rows;

            if(!records.length){
                throw new Error('테이블 스키마 확인 쿼리 오류입니다.');
            }else{
                // Todo. Convert from Array Schema 
                let schema = PostgresStatic.analyzerTableSchema(records);
                schema['tableName'] = tableName;
                schema['schemaName'] = schemaName;
                
                return schema;
            }
        }
    }

    async query(
        query: string, 
        values?: Array<any>, 
        options?: PostgresQueryOptions
    ): Promise<Postgres.QueryResult>{
        options = options || {};

        if(is.plainObject(values) && arguments.length == 2){
            options = <PostgresQueryOptions>values;
            values = null;
        }
        
        let isReleased = false;

        const 
            client = await this.node.connect(),
            result = await new Promise((resolve, reject) => {
                let timer = setTimeout(() => {
                        const error = new Error('제한시간을 초과했습니다.');
                        reject(error);
                        
                        if(!isReleased){
                            client.release(error);
                            isReleased = true;
                        }
                    }, options.timeout || DefaultQueryTimeout);

                this.node.query(query, values, (error, result) => {
                    if(timer) clearTimeout(timer);

                    if(!isReleased){
                        client.release();
                        isReleased = true;
                    }
                    
                    if(error) reject(error);
                    else resolve(result);
                });
            });

        return <Postgres.QueryResult>result;
    }

    async stream(
        query: string, 
        values?: Array<any>, 
        options?: PostgresQueryOptions
    ): Promise<Stream>{
        options = options || {};

        if(is.plainObject(values) && arguments.length == 2){
            options = <PostgresQueryOptions>values;
            values = null;
        }

        const 
            client = await this.node.connect(),
            streamQuery = new PostgresQueryStream(query, values),
            stream = client.query(streamQuery),
            output = new Stream.PassThrough();
        
        let isReleased = false;

        let timer = setTimeout(() => {
            const error = new Error('제한시간을 초과했습니다.');

            output.emit('error', error);

            if(!isReleased){
                client.release(error);
                isReleased = true;
            }

            stream.destroy();
        }, options.timeout || DefaultQueryTimeout);

        stream.on('end', () => {
            if(timer) clearTimeout(timer);

            if(!isReleased){
                client.release();
                isReleased = true;
            }
        });

        stream.pipe(JSONStream.stringify(false)).pipe(output);

        return output;
    }
}