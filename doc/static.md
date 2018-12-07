## static function

### function analyzerTableSchema(columnArray)
- 각 컬럼의 comment에 plain json이 있는 경우 가져와 참고

### function makeTableQuery(schema: any, table: any, options?: object)
- 넘겨지 인자를 가지고 테이블 작성 쿼리를 반환
- 각 컬럼의 comment로 작성 시 사용된 옵션(plain json)을 저장함
- 옵션(options)
    - useDefaultPrimary?: boolean = true : 설정된 기본키가 없을 경우 기본키 만듬 
    - useTimeStamps?: boolean = true : createAt, updateAt 기본 사용 여부
    - useZombodbIndex?: boolean = false
    - zombodbIndexFunc?: string