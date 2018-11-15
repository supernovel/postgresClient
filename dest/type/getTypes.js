"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Postgres = require("pg");
const checkObject_1 = __importDefault(require("checkObject"));
const config_1 = require("./../config");
async function getTypes(options) {
    options = checkObject_1.default(options, config_1.PostgresConfigSchema);
    let client = new Postgres.Client({
        host: options.host,
        user: options.user,
        port: options.port,
        database: options.database,
        password: options.password
    });
    await client.connect();
    let response = await client.query(`
            SELECT typname, oid
            FROM pg_type
            ORDER BY oid;
        `), types = {};
    response.rows.forEach((row) => {
        types[row.typname] = row.oid;
    });
    return types;
}
exports.default = getTypes;
