/*
*    FN  : default.ts
*    C   : 2018년 9월 7일 14:24:24 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/

import wkx = require('wkx');
import { setTypeParser } from './index';

setTypeParser(/^int\d$/, (val) => {
    return parseInt(val);
});

setTypeParser(/^float\d$/, (val) => {
    return parseFloat(val);
});

setTypeParser('numeric', (val) => {
    return parseFloat(val);
});

setTypeParser('geography', (val) => {
    return wkx.Geometry.parse(new Buffer(val, 'hex')).toGeoJSON();
});