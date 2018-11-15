/*
*    FN  : extension.ts
*    C   : 2018년 9월 3일 12:34:56 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/

import Debugger = require('debug');
import typeOf = require('kind-of');

import PostgresClient from '@/client';
import * as Sql from '@/sql';

const 
    Debug = Debugger('postgresExtension');

export async function initialize(client: PostgresClient, extensions: Array<string>){
    if(client && typeOf(extensions) === 'array' && extensions.length){
        await Promise.all(extensions.map((extension) => {
            return (async () => {
                if(typeof extension === 'string' && extension.length){
                    try {
                        switch(extension.toLowerCase()){
                            case 'zombodb':
                                await client.query(['create extension "', extension, '"'].join(''));
                                await client.query(Sql.zombo.initialize());
                                break;
                            default:
                                await client.query(['create extension "', extension, '"'].join(''));
                                break;
                        }
                    } catch (error){
                        Debug([extension, '추가에 실패하였습니다.', error.message].join(''));
                    }
                }
            });
        }));
    }
}