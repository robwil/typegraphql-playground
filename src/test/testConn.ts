import { createConnection } from 'typeorm';

export const testConn = (drop = false) => {
    return createConnection({
        name: 'default',
        type: 'cockroachdb',
        host: 'localhost',
        port: 26257,
        username: 'root',
        database: 'typegraphql_example_test',
        synchronize: drop,
        dropSchema: drop,
        entities: [`${__dirname}/../entity/*.*`],
    });
};
