"use strict";
/*
*    FN  : index.ts
*    C   : 2018년 9월 3일 11:45:46 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const types = require("pg-types");
const typeOf = require("kind-of");
const TYPES = require("./oid.json");
function getTypeParser(target, format) {
    switch (typeOf(target)) {
        case 'number':
            return types.getTypeParser(target, format);
        case 'string':
            return types.getTypeParser(TYPES[target] || target, format);
        case 'regexp':
            return Object.keys(TYPES).reduce((result, name) => {
                if (target.test(name)) {
                    result[name] = types.getTypeParser(TYPES[name], format);
                }
                return result;
            }, {});
        case 'array':
            return target.reduce((result, name) => {
                result[name] = types.getTypeParser(TYPES[name] || name, format);
                return result;
            }, {});
    }
}
exports.getTypeParser = getTypeParser;
function setTypeParser(target, format, parseFn) {
    if (typeof format == 'function') {
        parseFn = format;
        format = 'text';
    }
    switch (typeOf(target)) {
        case 'number':
            return types.setTypeParser(target, format, parseFn);
        case 'string':
            return types.setTypeParser(TYPES[target] || target, format, parseFn);
        case 'regexp':
            return Object.keys(TYPES).reduce((result, name) => {
                if (target.test(name)) {
                    result[name] = types.setTypeParser(TYPES[name], format, parseFn);
                }
                return result;
            }, {});
        case 'array':
            return target.reduce((result, name) => {
                result[name] = types.setTypeParser(TYPES[name] || name, format, parseFn);
                return result;
            }, {});
    }
}
exports.setTypeParser = setTypeParser;
exports.default = {
    getTypeParser,
    setTypeParser
};
//default
require('./default');
