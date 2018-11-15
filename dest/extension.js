"use strict";
/*
*    FN  : extension.ts
*    C   : 2018년 9월 3일 12:34:56 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Debugger = require("debug");
const typeOf = require("kind-of");
const Sql = __importStar(require("./sql"));
const Debug = Debugger('postgresExtension');
async function initialize(client, extensions) {
    if (client && typeOf(extensions) === 'array' && extensions.length) {
        await Promise.all(extensions.map((extension) => {
            return (async () => {
                if (typeof extension === 'string' && extension.length) {
                    try {
                        switch (extension.toLowerCase()) {
                            case 'zombodb':
                                await client.query(['create extension "', extension, '"'].join(''));
                                await client.query(Sql.zombo.initialize());
                                break;
                            default:
                                await client.query(['create extension "', extension, '"'].join(''));
                                break;
                        }
                    }
                    catch (error) {
                        Debug([extension, '추가에 실패하였습니다.', error.message].join(''));
                    }
                }
            });
        }));
    }
}
exports.initialize = initialize;
