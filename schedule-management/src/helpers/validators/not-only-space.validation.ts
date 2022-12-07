/* eslint-disable prettier/prettier */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'blankSpacesDinamic', async: false })
export class CustomNotOnlySpaces implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return !/^\s*$/.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Text is composed just for blank spaces';
  }
}
