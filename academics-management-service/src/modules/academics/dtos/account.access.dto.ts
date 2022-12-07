/* eslint-disable prettier/prettier */

import { IsEmail, MaxLength, MinLength, Validate } from 'class-validator';
import { CustomNotBlankSpaces } from 'src/helpers/validators';

export class AccountDto {
  @IsEmail({}, { message: 'El email no es válido' })
  @MinLength(5, { message: 'El email debe tener al menos 5 caracteres' })
  @MaxLength(99, {
    message: 'El email solo puede tener un máximo de 99 caracteres',
  })
  @Validate(CustomNotBlankSpaces, {
    message: 'El email no debe contener espacios en blanco',
  })
  email: string;

  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, {
    message: 'La contraseña solo puede tener un máximo de 50 caracteres',
  })
  @Validate(CustomNotBlankSpaces, {
    message: 'La contraseña no debe contener espacios en blanco',
  })
  password: string;
}
