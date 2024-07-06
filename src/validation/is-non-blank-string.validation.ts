import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isNotEmpty,
  isString,
  registerDecorator
} from 'class-validator';

@ValidatorConstraint()
export class IsNonBlankStringConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any): boolean | Promise<boolean> {
    return isString(value) && isNotEmpty(value.trim());
  }

  defaultMessage?(): string {
    return '$property must be a non-blank string';
  }
}

export function IsNonBlankString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNonBlankStringConstraint
    });
  };
}
