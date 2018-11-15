"use strict";
/*
*    FN  : config.ts
*    C   : 2018년 9월 3일 12:15:54 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresConfigSchema = {
    host: [
        /^host|address|url$/,
        process.env.PGHOST || 'localhost'
    ],
    user: [
        /^user$/,
        process.env.PGUSER || 'postgres'
    ],
    port: [
        /^port$/,
        process.env.PGPORT || '5432'
    ],
    password: [
        /^pass(word)?$/,
        process.env.PGPASSWORD
    ],
    database: [
        /^((db|database)(name)?|name)$/,
        process.env.PGDATABASE || 'postgres'
    ],
    idleTimeoutMillis: [/^((db|database)idletimeout(millis)?)$/, 1000],
    extensions: /^extension(s)?$/
};
