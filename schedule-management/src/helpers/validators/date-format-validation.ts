/* eslint-disable prettier/prettier */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customDateFormat', async: false })
export class CustomDateFormat implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    try {
      return new Date(date).getHours() ? true : false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Debes ingresar una fecha con formato: "yyyy-mm-dd hh:mm:ss"';
  }
}
