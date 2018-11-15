"use strict";
/*
*    FN  : generator.ts
*    C   : 2018년 9월 3일 11:45:23 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const fs_1 = require("fs");
const getTypes_1 = __importDefault(require("./getTypes"));
async function generator(options) {
    let types = await getTypes_1.default(options);
    return new Promise((resolve, reject) => {
        fs_1.writeFile(Path.resolve(__dirname, './oid.json'), JSON.stringify(types, null, 2), (error) => {
            if (error)
                reject(error);
            else
                resolve();
        });
    });
}
const argv = process.argv.slice(2), opts = {
    host: ['-h', '--host'],
    user: ['-u', '--user'],
    password: ['-p', '--pass', '--password'],
    database: ['-d', '--db', '--database']
}, optsValue = [], dbOpts = {};
Object.keys(opts).forEach((optKey) => {
    optsValue.push(...opts[optKey]);
});
Object.keys(opts).forEach((optKey) => {
    const check = opts[optKey];
    check.forEach((findStr) => {
        const findIndex = argv.indexOf(findStr);
        if (findIndex !== -1) {
            const findValue = argv[findIndex + 1];
            if (optsValue.indexOf(findValue) === -1) {
                dbOpts[optKey] = findValue;
            }
        }
    });
});
// @ts-ignore
dbOpts.database = 'tables';
generator(dbOpts)
    .then(() => {
    console.log('done generator oid');
    process.exit(0);
})
    .catch((error) => {
    console.log(error);
    process.exit(1);
});
