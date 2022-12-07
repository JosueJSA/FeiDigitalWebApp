/* eslint-disable prettier/prettier */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'blankSpaces', async: false })
export class CustomNotBlankSpaces implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return !/\s/.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Text contains blank spaces';
  }
}
