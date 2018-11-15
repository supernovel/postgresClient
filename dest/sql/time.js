"use strict";
/*
*    FN  : time.js
*    C   : 2018년 7월 17일 12:31:36 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
 */
Object.defineProperty(exports, "__esModule", { value: true });
function applyAutoUpdateFunc(schemaName) {
    return `
        CREATE OR REPLACE FUNCTION "${schemaName || 'public'}".update_updated_at_column() RETURNS trigger
            LANGUAGE plpgsql
            AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$;
    `.replace(/\n/g, '');
}
exports.applyAutoUpdateFunc = applyAutoUpdateFunc;
