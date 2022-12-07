/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { CustomDateFormat, CustomNotBlankSpaces } from 'src/helpers/validators';

export class SessionDto {
  @IsNotEmpty({ message: 'Se requiere una fecha para la clase' })
  @Validate(CustomDateFormat, {
    message: 'La fecha de la clase debe estar en formato: yyyy-mm-dd hh:mm:ss',
  })
  classDate: Date;

  @Validate(CustomDateFormat, {
    message:
      'La fecha de fin la clase debe estar en formato: yyyy-mm-dd hh:mm:ss',
  })
  @IsOptional()
  classDateEnd?: Date;

  @IsNotEmpty({ message: 'Se requiere un hora inicial para la clase' })
  @Validate(CustomDateFormat, {
    message:
      'Se requiere la fecha con formato de hora hh:mm:ss para la hora de inicio de la clase',
  })
  initialTime: Date;

  @IsNotEmpty({ message: 'Se requiere un hora de fin para la clase' })
  @Validate(CustomDateFormat, {
    message:
      'Se requiere la fecha con formato de hora hh:mm:ss para la hora de fin de la clase',
  })
  endTime: Date;

  @IsNotEmpty({
    message: 'Debes ingresar el valor para repetición de la clase',
  })
  repeated: boolean;

  @MinLength(1, {
    message: 'El NRC del curso debe tener al menos 1 caracter',
  })
  @MaxLength(50, {
    message: 'El NRC del curso solo puede tener un máximo de 50 caracteres',
  })
  @Validate(CustomNotBlankSpaces, {
    message: 'El NRC del curso no debe tener espacios en blanco',
  })
  courseNrc: string;

  @MinLength(1, {
    message: 'El código del aula debe tener al menos 1 caracter',
  })
  @MaxLength(50, {
    message: 'El código del aula solo puede tener un máximo de 50 caracteres',
  })
  @Validate(CustomNotBlankSpaces, {
    message: 'El código del aula no debe tener espacios en blanco',
  })
  classroomCode: string;
}
