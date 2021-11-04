import 'reflect-metadata';
import fs from 'fs';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { Connection, createConnection } from 'typeorm';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import { createGraphqlSchema } from './utils/createGraphqlSchema';

declare module 'express-session' {
    export interface SessionData {
        userId: number;
    }
}

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
    const pgConnection = await createConnection();

    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        schema: await createGraphqlSchema(),
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            // use GraphQL playground instead of Apollo Studio
            // because it works a lot better with session cookies
            ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        // pass Express request and response to Apollo/GraphQL resolvers
        /* eslint-disable-next-line */
        context: ({ req, res }: any) => ({ req, res }),
    });
    await server.start();

    const PgSession = connectPgSimple(session);
    const sessionOption: session.SessionOptions = {
        store: new PgSession({
            tableName: 'session',
            conObject: {
                connectionString:
                    extractConnectionStringFromTypeOrmConnection(pgConnection),
                ssl: { ca: fs.readFileSync('certs/cockroach.crt').toString() },
            },
        }),
        name: 'qid',
        secret: process.env.SESSION_SECRET || '',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        },
    };
    app.use(
        cors({
            credentials: true,
            // origin of what would eventually be the frontend
            origin: 'http://localhost:3000',
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
