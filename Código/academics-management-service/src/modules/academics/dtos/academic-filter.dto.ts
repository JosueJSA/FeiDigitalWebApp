/* eslint-disable prettier/prettier */
import { IsOptional } from 'class-validator';

export class AcademicFilterDto {
  @IsOptional()
  email: string;

  @IsOptional()
  fullName: string;
}
