import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { buildSchema } from 'type-graphql';
import { Connection, createConnection } from 'typeorm';
import session from 'express-session';
// @ts-ignore doesn't have @types file and I don't care to make one
import connectCockroachSimple from 'connect-cockroachdb-simple';
import cors from 'cors';
import { RegisterResolver } from './modules/user/Register';
import { LoginResolver } from './modules/user/Login';

// simple function to derive PG connection string from TypeORM connection,
// so we don't have to repeat ourselves for config
function extractConnectionStringFromTypeOrmConnection(
    connection: Connection
): string {
    // @ts-ignore it doesn't know what kind of connection we have
    const { username, password, database, host, port } = connection.options;
    return `postgres://${username}:${password}@${host}:${port}/${database}`;
}

const main = async () => {
    dotenv.config();
    const conn = await createConnection();

    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [RegisterResolver, LoginResolver],
            // automatically create `schema.gql` file with schema definition in current folder
            emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
        }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        // pass Express request to Apollo/GraphQL resolvers
        /* eslint-disable-next-line */
        context: ({ req }: any) => ({ req }),
    });
    await server.start();

    const CockroachSession = connectCockroachSimple(session);
    const sessionOption: session.SessionOptions = {
        store: new CockroachSession({
            tableName: 'session',
            conObject: {
                connectionString:
                    extractConnectionStringFromTypeOrmConnection(conn),
                ssl: { ca: fs.readFileSync('certs/cockroach.crt').toString() },
            },
        }),
        name: 'qid',
        secret: process.env.SESSION_SECRET || '',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        },
    };
    app.use(
        cors({
            credentials: true,
            origin: 'https://studio.apollographql.com',
        })
    );
    app.use(session(sessionOption));

    server.applyMiddleware({ app });

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 4000 }, resolve)
    );
    /* eslint-disable-next-line */
    console.log(`🚀 Server is running, GraphQL playground available at http://localhost:4000${server.graphqlPath}`);
};

main();
