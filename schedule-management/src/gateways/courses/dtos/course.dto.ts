/* eslint-disable prettier/prettier */
import { MaxLength, MinLength, Validate } from 'class-validator';
import {
  CustomNotBlankSpaces,
  CustomNotOnlySpaces,
} from 'src/helpers/validators';

export class CourseDto {
  @MinLength(1, { message: 'El NRC debe contener al menos 1 caracter' })
  @MaxLength(50, { message: 'El NRC no puede contener más de 50 caracteres' })
  @Validate(CustomNotBlankSpaces, {
    message: 'El NRC no debe contener espacios en blanco',
  })
  nrc: string;

  @MinLength(3, {
    message: 'El nombre del curso debe tener al menos 3 caracteres',
  })
  @MaxLength(99, {
    message: 'El nombre del curso no debe tener más de 99 caracteres',
  })
  @Validate(CustomNotOnlySpaces, {
    message:
      'El nombre del curso no puede estar conformado solo por espacios en blanco',
  })
  name: string;

  @MinLength(1, {
    message: 'El identificador del académico debe tener al menos 1 caracter',
  })
  @MaxLength(100, {
    message:
      'El identificador del académico no puede tener más de 100 caracteres',
  })
  @Validate(CustomNotBlankSpaces, {
    message:
      'El identificador del académico no debe contener espacios en blanco',
  })
  idAcademicPersonal: string;
}
