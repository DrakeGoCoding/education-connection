import { IsArrayUnique } from '@/validators/is-array-unique.validator';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class RegisterStudentsDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  teacher: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  @IsArrayUnique({})
  students: string[];
}
