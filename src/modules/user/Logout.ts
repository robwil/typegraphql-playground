import { Ctx, Mutation, Resolver } from 'type-graphql';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class LogoutResolver {
    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: MyContext): Promise<boolean> {
        return new Promise((resolve, reject) => {
            ctx.req.session.destroy((err) => {
                if (err) {
                    return reject(new Error('failed to clear session'));
                }
                ctx.res.clearCookie('qid');
                return resolve(true);
            });
        });
    }
}
