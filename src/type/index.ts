/*
*    FN  : index.ts
*    C   : 2018년 9월 3일 11:45:46 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/

import types = require('pg-types');
import typeOf = require('kind-of');
import wkx = require('wkx');

import TYPES = require('./oid.json');

export function getTypeParser(
    target: number|string|RegExp|Array<string|number>, 
    format: string
): types.TypeParser|object {
    switch(typeOf(target)){
        case 'number':
            return types.getTypeParser(<number>target, format);
        case 'string':
            return types.getTypeParser(TYPES[<string>target] || target, format);
        case 'regexp':
            return Object.keys(TYPES).reduce((result, name) => {
                if((<RegExp>target).test(name)){
                    result[name] = types.getTypeParser(TYPES[name], format);
                }

                return result;
            }, {});
        case 'array':
            return (<Array<string>>target).reduce((result, name) => {
                result[name] = types.getTypeParser(TYPES[name] || name, format);

                return result;
            }, {});
    }
}

export function setTypeParser(
    target:number|string|RegExp|Array<string|number>, 
    format:string|types.TypeParser, 
    parseFn?:types.TypeParser
): any {
    if(typeof format == 'function') {
        parseFn = format;
        format = 'text';
    }

    switch(typeOf(target)){
        case 'number':
            return types.setTypeParser(<number>target, format, parseFn);
        case 'string':
            return types.setTypeParser(TYPES[<string>target] || target, format, parseFn);
        case 'regexp':
            return Object.keys(TYPES).reduce((result, name) => {
                if((<RegExp>target).test(name)){
                    result[name] = types.setTypeParser(
                        TYPES[name], 
                        <string>format, 
                        parseFn
                    );
                }

                return result;
            }, {});
        case 'array':
            return (<Array<string>>target).reduce((result, name) => {
                result[name] = types.setTypeParser(
                    TYPES[name] || name, 
                    <string>format, 
                    parseFn
                );

                return result;
            }, {});
    }
}

export default {
    getTypeParser,
    setTypeParser
}

//default
require('./default');