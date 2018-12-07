## Postgresql Client

- knex 및 mongo-sql 빌더를 사용해 쿼리 작성
- 테이블을 json으로 작성 가능(getTable 함수)
- [zombodb](https://github.com/zombodb/zombodb)에 대한 쿼리 포함

```
...

const ClientConstructor = require('postgreClient').Client;

...

const Client = new ClientConstructor(options);

...

await Client.connect();

...

const testTable = await Client.getTable('test', {
    name: {
        type: 'string',
        default: 'default'
    },
    id: {
        type: 'increments',
        primary: true
    }
});

testTable.insert({
    name: 'test',
    id: 1
});

await testTable.send();

```

### [Class PostgresClient  (client.ts)](doc/client.md)
### [Class PostgresTable  (table.ts)](doc/table.md)
### [type folder](doc/type.md)
### [static folder](doc/static.md)