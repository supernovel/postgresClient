/*
*    FN  : PostgresTable.ts
*    C   : 2018년 8월 9일 20:14:18 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/

import { QueryBuilder } from 'knex';

import PostgresClient from '@/client';
import PostgresStatic from '@/static';

const 
    ProxyIgnore = ['toString'],
    ProxyHandeler = {
        get: function(target: PostgresTable, name: string){
            if(target[name] && ProxyIgnore.indexOf(name) === -1){
                return target[name];
            }else if(target.$builder){
                if(typeof target.$builder[name] == 'function'){
                    return function(){
                        var result = target.$builder[name](...arguments);

                        if(result === target.$builder){
                            return target.$proxy;
                        }else{
                            return result;
                        }
                    };
                }else return target.$builder[name];
            }
        }
    };

export default class PostgresTable{
    constructor(name: string, db: PostgresClient, schema: any){
        this.$name = name;
        this.$db = db;
        this.$tableSchema = schema;

        this.initialize();

        return (this.$proxy = new Proxy(this, ProxyHandeler));
    }

    $name: string
    $db: PostgresClient
    $tableSchema: any
    $builder: any
    $proxy: PostgresTable

    initialize(){
        this.$builder = this.$db.builder(this.$name);
    }

    rawQuery(...args){
        return this.$db.builder.raw.call(
            this.$db.builder,
            ...args
        );
    }

    getName(){
        return this.$name;
    }

    getSchema(){
        return this.$tableSchema;
    }

    async send(){
        await this.$db.query(this.toString());
    }

    checkSchema(){
        return PostgresStatic.checkSchema.call(this);
    }
}

export default interface PostgresTable extends QueryBuilder{
    insert(data: any, returning?: string | string[]): PostgresTable;
}