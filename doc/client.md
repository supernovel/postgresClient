## class PostgresClient

### constructor(options?: [PostgresConfig](doc/client.md))

### get builder()

- return knex builder (https://knexjs.org)

### get moBuilder()

- return mongo-sql builder (https://github.com/goodybag/mongo-sql#readme)

### async connect():Promise<void>

- 환경 변수나 옵션을 토대로 연결 요청
- 존재하지 않는 데이터베이스에 대한 요청인 경우 데이터베이스 생성

### async getTable(name:string, schema?: any): Promise<PostgresTable>

- 해당 이름의 테이블이 존재하는지 확인 및 생성(schema가 존재하는 경우) 후 PostgresTable instance 반환

### [async creataTableToJson(schema: any)](static.md)

### async getTableSchema(schemaName: string, tableName: string)

### async query(query: string, values?: Array<any>, options?: PostgresQueryOptions): Promise<Postgres.QueryResult>

### async stream(query: string, values?: Array<any>, options?: PostgresQueryOptions): Promise<Stream>