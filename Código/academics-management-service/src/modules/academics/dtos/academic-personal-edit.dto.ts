/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { AcademicPersonalDto } from './academic-personal.dto';
import { AcademicStatus } from './enums';

export class AcademicPersonalEditDto extends AcademicPersonalDto {
  @IsEnum(AcademicStatus, {
    message: 'El status del académico no se encuantra registrado',
  })
  @IsOptional()
  status: string;
}
