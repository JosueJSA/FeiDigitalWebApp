/* eslint-disable prettier/prettier */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'blankSpacesDinamic', async: false })
export class CustomNotOnlySpaces implements ValidatorConstraintInterface {
  validate(text: string) {
    return !/^\s*$/.test(text);
  }

  defaultMessage() {
    return 'Text is composed just for blank spaces';
  }
}
