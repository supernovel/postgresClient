import is from '@sindresorhus/is';
import { assignIn } from 'lodash';
import { Regexp } from './index';

export function analyzerTableSchema(columnArray){
    var schemaObject= {};
    
    for(var idx=0; idx<columnArray.length; idx++){
        var column = columnArray[idx],
            typeExec = Regexp.columnType.exec(column.type),
            type = typeExec[0],
            maxLength = typeExec[1],
            comment = eval(`
                (function(){ return ${column.comment} })()`
            ),
            commentType = is(comment).toLowerCase();

        if(commentType === 'string' && comment.length){
            comment = [ comment, {} ];
        }else if(commentType !== 'array' || comment.length !== 2){
            comment = [ '', {} ];
        }

        switch(type){
            default:
                schemaObject[column.field] = {
                    type: type,
                    length: maxLength
                };
        }

        if(comment[0].length){
            schemaObject[column.field].comment = comment;
        }

        schemaObject[column.field] = assignIn(
            schemaObject[column.field],
            comment[1]
        );
    }

    return schemaObject;
}

export function checkSchema(table, target){
    var diff = {},
        schema = table.getSchema();

    for(var key in target){
        if(schema[key] == null) diff[key] = 'VARCHAR(255)';
    }

    if(Object.keys(diff).length) return diff;
    else return false;
}