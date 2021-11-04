import { Connection } from 'typeorm';
import faker from 'faker';

import { GraphQLError } from 'graphql';
import { testConn } from '../../../test/testConn';
import { gCall } from '../../../test/gCall';
import { User } from '../../../entity/User';

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe('Register', () => {
    let conn: Connection;
    beforeAll(async () => {
        conn = await testConn();
    });
    afterAll(async () => {
        await conn.close();
    });

    it('creates new user', async () => {
        const user = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        const response = await gCall({
            source: registerMutation,
            variableValues: {
                data: user,
            },
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            },
        });

        const dbUser = await User.findOne({ where: { email: user.email } });
        expect(dbUser).toBeDefined();
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        expect(dbUser!.firstName).toBe(user.firstName);
    });

    it('fails with validation error if email is invalid', async () => {
        const user = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: 'blah@gogogo',
            password: faker.internet.password(),
        };

        const response = await gCall({
            source: registerMutation,
            variableValues: {
                data: user,
            },
        });

        expect(response).toMatchObject({
            data: null,
            errors: [new GraphQLError('Argument Validation Error')],
        });
    });
});
