import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { RegisterStudentsDto } from '@/dtos/register-students.dto';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';

@Injectable()
export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly studentRepository: StudentRepository,
    private readonly teacherStudentRepository: TeacherStudentRepository
  ) {}

  async registerStudents(registerStudentsDto: RegisterStudentsDto) {
    const { teacher, students } = registerStudentsDto;
    const foundTeacher = await this.teacherRepository.findOneByEmail(teacher);

    if (!foundTeacher) {
      throw new HttpException('Teacher not found', HttpStatus.BAD_REQUEST);
    }

    const foundStudents = await this.studentRepository.findByEmails(students);
    if (foundStudents.length !== students.length) {
      throw new HttpException(
        'Some students not found',
        HttpStatus.BAD_REQUEST
      );
    }

    const newTeacherStudents = foundStudents.map((student) => ({
      teacherId: foundTeacher.id,
      studentId: student.id,
    }));

    await this.teacherStudentRepository.save(newTeacherStudents);
  }
}
