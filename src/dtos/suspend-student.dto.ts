import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SuspendStudentDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  student: string;
}
