/* eslint-disable prettier/prettier */

import { IsOptional } from 'class-validator';
import {} from 'src/helpers/validators';

export class StudentFilterDto {
  @IsOptional()
  email: string;

  @IsOptional()
  name: string;
}
