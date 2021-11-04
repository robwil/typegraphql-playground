import { Ctx, Query, Resolver } from 'type-graphql';
import { MyContext } from 'src/types/MyContext';
import { User } from '../../entity/User';

@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
        // @ts-ignore TS doesn't know about SessionData
        const { userId } = ctx.req.session;
        if (!userId) {
            return undefined;
        }
        const user = await User.findOne(userId);
        return user;
    }
}
