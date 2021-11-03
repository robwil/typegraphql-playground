import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { MyContext } from 'src/types/MyContext';
import { User } from '../../entity/User';

@Resolver()
export class LoginResolver {
    @Mutation(() => User, { nullable: true })
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return null;
        }
        // NOTE: For some reason, setting this breaks responses. It causes the response to hang forever open.
        // @ts-ignore TS doesn't know about SessionData
        ctx.req.session.userId = user.id;
        return user;
    }
}
