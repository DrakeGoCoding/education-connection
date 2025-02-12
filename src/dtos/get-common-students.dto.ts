import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { IsArrayUnique } from '@/validators/is-array-unique.validator';

export class GetCommonStudentsDto {
  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsEmail({}, { each: true })
  @IsArrayUnique()
  teacher: string[];
}
