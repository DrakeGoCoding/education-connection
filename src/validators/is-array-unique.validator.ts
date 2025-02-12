/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsArrayUnique', async: false })
class IsArrayUniqueConstraint implements ValidatorConstraintInterface {
  validate(array: any[], validationArguments: ValidationArguments) {
    return Array.isArray(array) && new Set(array).size === array.length;
  }

  defaultMessage(validationArguments: ValidationArguments) {
    return `All elements in $property must be unique!`;
  }
}

export function IsArrayUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    Validate(IsArrayUniqueConstraint, validationOptions)(object, propertyName);
  };
}
