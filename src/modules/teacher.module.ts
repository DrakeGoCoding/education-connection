import { Module } from '@nestjs/common';

import { TeacherController } from '@/controllers/teacher.controller';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { TeacherService } from '@/services/teacher.service';

@Module({
  controllers: [TeacherController],
  providers: [
    TeacherService,
    TeacherRepository,
    StudentRepository,
    TeacherStudentRepository,
  ],
})
export class TeacherModule {}
