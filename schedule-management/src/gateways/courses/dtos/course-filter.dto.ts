/* eslint-disable prettier/prettier */
import { IsOptional } from 'class-validator';

export class CourseFilterDto {
  @IsOptional()
  nrc: string;

  @IsOptional()
  name: string;
}
