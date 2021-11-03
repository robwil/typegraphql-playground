import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
/* eslint-disable */
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface
{
    validate(email: string) {
        return User.findOne({ where: { email } }).then((user) => {
            if (user) {
                return false;
            }
            return true;
        });
    }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
    return (object: Record<string, unknown>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistConstraint,
        });
    };
}
