import 'reflect-metadata';
import * as path from 'path';
import { ApolloServer } from 'apollo-server';
import { buildSchema, Query, Resolver } from 'type-graphql';

@Resolver(String)
class HelloResolver {
    @Query(() => String, {name: 'helloWorld'})
    async hello() {
        return "Hello world";
    }
}

const main = async () => {
    const schema = await buildSchema({
        resolvers: [HelloResolver],
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