import { Injectable, OnModuleInit } from '@nestjs/common';

import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';

const SAMPLE_STUDENTS = Array.from({ length: 40 }).map((_, index) => ({
  email: `student${index + 1}@gmail.com`,
}));
const SAMPLE_TEACHERS = Array.from({ length: 5 }).map((_, index) => ({
  email: `teacher${index + 1}@gmail.com`,
}));

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly teacherStudentRepository: TeacherStudentRepository
  ) {}

  async onModuleInit() {
    // only seeding students and teachers when database is empty
    const countStudent = await this.studentRepository.count({});
    const countTeacher = await this.teacherRepository.count({});

    if (countStudent === 0) {
      await this.studentRepository.save(SAMPLE_STUDENTS);
    }

    if (countTeacher === 0) {
      await this.teacherRepository.save(SAMPLE_TEACHERS);
    }

    // clear teacher-student table
    await this.teacherStudentRepository.delete({});
  }
}
