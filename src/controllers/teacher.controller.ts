import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { GetCommonStudentsDto } from '@/dtos/get-common-students.dto';
import { RegisterStudentsDto } from '@/dtos/register-students.dto';
import { SuspendStudentDto } from '@/dtos/suspend-student.dto';
import { TeacherService } from '@/services/teacher.service';

@Controller('/api')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerStudents(@Body() registerStudentsDto: RegisterStudentsDto) {
    return this.teacherService.registerStudents(registerStudentsDto);
  }

  @Get('/commonstudents')
  @HttpCode(HttpStatus.OK)
  async getCommonStudents(@Query() getCommonStudentsDto: GetCommonStudentsDto) {
    return this.teacherService.getCommonStudents(getCommonStudentsDto);
  }

  @Post('/suspend')
  @HttpCode(HttpStatus.NO_CONTENT)
  async suspendStudent(@Body() suspendStudentDto: SuspendStudentDto) {
    return this.teacherService.suspendStudent(suspendStudentDto);
  }
}
