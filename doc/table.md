## class PostgresTable extends [Knex](https://knexjs.org)


### constructor(name: string, db: PostgresClient, schema: any)

### initialize()

- sql builder 작업 내용 초기화

### rawQuery(...args)

### getName()

- 테이블 이름

### getSchema()

- 테이블 스키마 이름

### async send() 

- [PostgreClient의 query함수 사용](client.md)
- 테이블 빌더로 생성된 쿼리를 전송 및 결과 반환

### [checkSchema()](static.md)