import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from 'bcryptjs';
import { User } from "../../entity/User";

@Resolver(User)
export class RegisterResolver {
    // dummy query to appease GraphQL for now
    @Query(() => String, {name: 'helloWorld'})
    async hello() {
        return "Hello world";
    }

    @Mutation(() => User)
    async register(
        @Arg('firstName') firstName: string,
        @Arg('lastName') lastName: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }).save();
        return user;
    }
}