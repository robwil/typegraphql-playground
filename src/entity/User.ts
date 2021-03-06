import { Field, ID, ObjectType, Root } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    // Calculated field from firstName + lastName
    @Field()
    name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`;
    }

    @Field()
    @Column('text', { unique: true })
    email: string;

    @Column()
    password: string;
}
