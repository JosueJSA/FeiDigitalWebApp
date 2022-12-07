/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import {
  CustomNotBlankSpaces,
  CustomNotOnlySpaces,
} from '../../../helpers/validators/';
import { AcademicType } from './enums';

export class AcademicPersonalDto {
  @IsEmail({}, { message: 'El email no es válido' })
  @Validate(CustomNotBlankSpaces, {
    message: 'El email no debe contener espacios en blanco',
  })
  @MinLength(5, { message: 'El email debe tener al menos 5 caracteres' })
  @MaxLength(99, {
    message: 'El email debe contener como máximo 99 caracteres',
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

  @MinLength(3, { message: 'El nombre debe contener al menos 3 caracteres' })
  @MaxLength(99, {
    message: 'El nombre no debe exceder los 99 caracteres',
  })
  @Validate(CustomNotOnlySpaces, {
    message: 'El nombre no puede contener solo espacios en blanco',
  })
  fullName: string;

  @IsEnum(AcademicType, {
    message: 'El tipo de área de trabajo del académico no está registrada',
  })
  position: string;

  @IsNotEmpty({
    message: 'El código de la ubicación en la FEI no puede estar vacío',
  })
  @MaxLength(50, {
    message:
      'El código de la ubicación en la FEI puede tener solo hasta 50 caracteres',
  })
  @Validate(CustomNotBlankSpaces, {
    message:
      'El código de la ubicación en la FEI no debe contener espacios en blanco',
  })
  @IsOptional()
  feiLocationCode?: string;
}
