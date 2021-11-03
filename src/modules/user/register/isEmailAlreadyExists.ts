import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
/* eslint-disable-next-line */
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
    /* eslint-disable-next-line */
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistConstraint,
        });
    };
}
