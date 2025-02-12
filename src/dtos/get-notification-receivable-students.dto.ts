import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetNotificationReceivableStudentsDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  teacher: string;

  @IsNotEmpty()
  @IsString()
  notification: string;
}
