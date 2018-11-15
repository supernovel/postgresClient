"use strict";
/*
*    FN  : default.ts
*    C   : 2018년 9월 7일 14:24:24 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const wkx = require("wkx");
const index_1 = require("./index");
index_1.setTypeParser(/^int\d$/, (val) => {
    return parseInt(val);
});
index_1.setTypeParser(/^float\d$/, (val) => {
    return parseFloat(val);
});
index_1.setTypeParser('numeric', (val) => {
    return parseFloat(val);
});
index_1.setTypeParser('geography', (val) => {
    return wkx.Geometry.parse(new Buffer(val, 'hex')).toGeoJSON();
});
