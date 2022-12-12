/* eslint-disable prettier/prettier */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'blankSpaces', async: false })
export class CustomNotBlankSpaces implements ValidatorConstraintInterface {
  validate(text: string) {
    return !/\s/.test(text);
  }

  defaultMessage() {
    return 'Text contains blank spaces';
  }
}
