## type

- postgres 타입에 대한 parser 정의
- postgres 타입 json 작성(generator.ts)(oid.json)
- ```
    const type = require('postgresClient/type);

    ...

    type.getTypeParser()
    type.setTypeParser()

### function getTypeParser(
    target: number|string|RegExp|Array<string|number>, 
    format: string
): types.TypeParser|object 

- oid.json을 기반으로 해당 Parser를 가져옴

### function setTypeParser(
    target:number|string|RegExp|Array<string|number>, 
    format:string|types.TypeParser, 
    parseFn?:types.TypeParser
): any 

- oid.json을 기반으로 해당 Parser를 등록
- parseFn : (value: any) => any