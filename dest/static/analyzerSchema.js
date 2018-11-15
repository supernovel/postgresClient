"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __importDefault(require("@sindresorhus/is"));
const lodash_1 = require("lodash");
const index_1 = require("./index");
function analyzerTableSchema(columnArray) {
    var schemaObject = {};
    for (var idx = 0; idx < columnArray.length; idx++) {
        var column = columnArray[idx], typeExec = index_1.Regexp.columnType.exec(column.type), type = typeExec[0], maxLength = typeExec[1], comment = eval(`
                (function(){ return ${column.comment} })()`), commentType = is_1.default(comment).toLowerCase();
        if (commentType === 'string' && comment.length) {
            comment = [comment, {}];
        }
        else if (commentType !== 'array' || comment.length !== 2) {
            comment = ['', {}];
        }
        switch (type) {
            default:
                schemaObject[column.field] = {
                    type: type,
                    length: maxLength
                };
        }
        if (comment[0].length) {
            schemaObject[column.field].comment = comment;
        }
        schemaObject[column.field] = lodash_1.assignIn(schemaObject[column.field], comment[1]);
    }
    return schemaObject;
}
exports.analyzerTableSchema = analyzerTableSchema;
function checkSchema(table, target) {
    var diff = {}, schema = table.getSchema();
    for (var key in target) {
        if (schema[key] == null)
            diff[key] = 'VARCHAR(255)';
    }
    if (Object.keys(diff).length)
        return diff;
    else
        return false;
}
exports.checkSchema = checkSchema;
