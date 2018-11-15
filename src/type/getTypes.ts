import Postgres = require('pg');

import checkOptions from 'checkObject';
import { PostgresConfigSchema } from '@/config';

export default async function getTypes(options: Postgres.ClientConfig){
    options = checkOptions(options, PostgresConfigSchema);

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
        `),
        types = {};

    response.rows.forEach((row) => {
        types[row.typname] = row.oid;
    });

    return types;
}
