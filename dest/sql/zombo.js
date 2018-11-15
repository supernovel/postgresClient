"use strict";
/*
*    FN  : zombo.ts
*    C   : 2018년 9월 3일 12:26:29 작성
*    DS  :
*    N   :
*    A   : supernovel(ekfueh@naver.com)
*    L   : 모든 권한은 supernovel(ekfueh@naver.com)에 있습니다.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludeType = ['jsonb'];
exports.excludeName = ['Geometry'];
exports.excludeOptionName = 'excludeZombodb';
function initialize() {
    return `
        CREATE DOMAIN zdb.korean AS TEXT;
        CREATE DOMAIN zdb.korean_with_suggest AS TEXT;
        
        SELECT zdb.define_filter('ngram_filter', '{
            "type": "edge_ngram",
            "min_gram": "1",
            "max_gram": "20"
        }');
        
        SELECT zdb.define_analyzer('ngram', '{
            "filter": [
                "trim",
                "lowercase",
                "ngram_filter"
            ],
            "type": "custom",
            "tokenizer": "standard"
        }');
        
        SELECT zdb.define_analyzer('korean', '{
            "filter": [
                "lowercase",
                "trim",
                "ngram_filter"
            ],
            "tokenizer": "seunjeon_tokenizer"
        }');
        
        SELECT zdb.define_type_mapping('zdb.korean', '{
            "type": "text", 
            "copy_to": "zdb_all", 
            "analyzer": "korean",
            "fields": {
                "keyword": {
                    "type": "keyword"
                },
                "space": {
                    "type": "text",
                    "analyzer": "whitespace"
                },
                "tokenized": {
                    "type": "text",
                    "analyzer": "ngram"
                }
            }
        }');
        
        SELECT zdb.define_type_mapping('zdb.korean_with_suggest', '{
            "type": "text", 
            "copy_to": "zdb_all", 
            "analyzer": "korean",
            "fields": {
                "keyword": {
                    "type": "keyword"
                },
                "space": {
                    "type": "text",
                    "analyzer": "whitespace"
                },
                "suggest": {
                    "type": "completion",
                    "analyzer": "simple",
                    "preserve_separators": true,
                    "preserve_position_increments": true,
                    "max_input_length": 50
                },
                "tokenized": {
                    "type": "text",
                    "analyzer": "ngram"
                }
            }
        }');
    `;
}
exports.initialize = initialize;
function indexing(schemaName, tableName, useFieldsOrFunc) {
    schemaName = schemaName || 'public';
    if (typeof useFieldsOrFunc === 'string') {
        return `
            CREATE INDEX "${tableName}_zdb_index"
            ON "${schemaName}"."${tableName}"
            USING zombodb ("${schemaName}"."${useFieldsOrFunc}"("${tableName}"));
        `;
    }
    else {
        return `
            CREATE TYPE "${schemaName}"."${tableName}_row_type" AS (${useFieldsOrFunc.map((v) => {
            return `"${v.key}" ${v.type}`;
        }).join(', ')});

            CREATE OR REPLACE FUNCTION "${schemaName}"."${tableName}_form"(${schemaName.toLowerCase()}."${tableName}")
            RETURNS "${schemaName}"."${tableName}_row_type"
            IMMUTABLE STRICT 
            LANGUAGE 'sql'
            PARALLEL UNSAFE
                AS $BODY$
                    SELECT ${useFieldsOrFunc.map((v) => {
            return `$1."${v.key}"::${v.type}`;
        }).join(', ')}
                $BODY$;

            CREATE INDEX "${tableName}_zdb_index"
            ON "${schemaName}"."${tableName}"
            USING zombodb ("${schemaName}"."${tableName}_form"("${tableName}"));
        `;
    }
}
exports.indexing = indexing;
