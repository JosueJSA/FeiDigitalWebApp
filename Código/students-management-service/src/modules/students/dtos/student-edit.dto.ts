/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { StudentStatus } from './enumerations';
import { StudentDto } from './student.dto';

export class StudentEditDto extends StudentDto {
  @IsEnum(StudentStatus, { message: 'El estatus no es válido' })
  @IsOptional()
  status: string;
}
