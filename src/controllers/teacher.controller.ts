import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { RegisterStudentsDto } from '@/dtos/register-students.dto';
import { TeacherService } from '@/services/teacher.service';

@Controller('/api')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerStudents(@Body() registerStudentDto: RegisterStudentsDto) {
    return this.teacherService.registerStudents(registerStudentDto);
  }
}
