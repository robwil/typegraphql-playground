import { MyContext } from 'src/types/MyContext';
import { MiddlewareFn } from 'type-graphql';

// This is an example of a custom type-graphql middleware that performs an authentication check.
// More complex authorization could also be done here.
export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error('Access denied');
    }
    return next();
};
