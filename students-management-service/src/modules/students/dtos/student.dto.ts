/* eslint-disable prettier/prettier */

import { IsEmail, MaxLength, MinLength, Validate } from 'class-validator';
import {
  CustomNotBlankSpaces,
  CustomNotOnlySpaces,
} from 'src/helpers/validators';

export class StudentDto {
  @IsEmail({}, { message: 'El email no es válido' })
  @MinLength(5, { message: 'El email debe contener al menos 5 caracteres' })
  @MaxLength(99, {
    message: 'El email no puede contener más de 99 caracteres',
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

  @MinLength(3, { message: 'El nombre debe contener almenos 3 caracteres' })
  @MaxLength(99, {
    message: 'El nombre no debe exceder los 99 caracteres',
  })
  @Validate(CustomNotOnlySpaces, {
    message: 'El nombre no puede contener solo espacios en blanco',
  })
  name: string;
}
