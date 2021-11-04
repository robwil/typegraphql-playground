import { Authorized, Query, Resolver, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';

@Resolver()
export class SampleAuthedQueriesResolver {
    @Authorized()
    @Query(() => String)
    async hello() {
        return 'Hello world';
    }

    @UseMiddleware(isAuth)
    @Query(() => String)
    async helloMiddleware() {
        return 'Hello world';
    }
}
