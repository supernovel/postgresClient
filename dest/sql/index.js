"use strict";
/*
*    FN  : index.ts
*    C   : 2018년 8월 8일 10:08:33 작성
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
const table = __importStar(require("./../sql/table"));
exports.table = table;
const time = __importStar(require("./../sql/time"));
exports.time = time;
const zombo = __importStar(require("./../sql/zombo"));
exports.zombo = zombo;
