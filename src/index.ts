import 'reflect-metadata';
import * as path from 'path';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';

const main = async () => {
    require('dotenv').config();

    await createConnection();

    const schema = await buildSchema({
        resolvers: [RegisterResolver],
        // automatically create `schema.gql` file with schema definition in current folder
        emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    })
    const server = new ApolloServer({
        schema
    });
    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL playground available at ${url}`);
};

main();