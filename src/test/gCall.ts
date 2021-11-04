import { graphql, GraphQLSchema } from 'graphql';

import { createGraphqlSchema } from '../utils/createGraphqlSchema';

interface Options {
    source: string;
    variableValues?: {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        [key: string]: any;
    };
    userId?: number;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, userId }: Options) => {
    if (!schema) {
        schema = await createGraphqlSchema();
    }
    return graphql({
        schema,
        source,
        variableValues,
        contextValue: {
            req: {
                session: {
                    userId,
                },
            },
            res: {
                clearCookie: jest.fn(),
            },
        },
    });
};
