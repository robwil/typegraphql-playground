import { Connection } from 'typeorm';
import faker from 'faker';

import { testConn } from '../../../test/testConn';
import { gCall } from '../../../test/gCall';
import { User } from '../../../entity/User';

const meQuery = `
 {
  me {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe('Me', () => {
    let conn: Connection;
    beforeAll(async () => {
        conn = await testConn();
    });
    afterAll(async () => {
        await conn.close();
    });

    it('returns current user details when logged in', async () => {
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }).save();

        const response = await gCall({
            source: meQuery,
            userId: user.id,
        });

        expect(response).toMatchObject({
            data: {
                me: {
                    id: `${user.id}`,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            },
        });
    });

    it('returns null when user is not logged in', async () => {
        const response = await gCall({
            source: meQuery,
        });

        expect(response).toMatchObject({
            data: {
                me: null,
            },
        });
    });
});
