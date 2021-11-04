import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

export function createGraphqlSchema(): Promise<GraphQLSchema> {
    return buildSchema({
        resolvers: [`${__dirname}/../modules/**/*.ts`],
        authChecker: ({ context }) => {
            // for now, our @Authorized() annotation doesn't look at roles and just checks for logged in user
            if (context.req.session.userId) {
                return true;
            }
            return false;
        },
        // automatically create `schema.gql` file with schema definition
        emitSchemaFile: `${__dirname}/../schema.gql`,
    });
}
