import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { GetCommonStudentsDto } from '@/dtos/get-common-students.dto';
import { GetNotificationReceivableStudentsDto } from '@/dtos/get-notification-receivable-students.dto';
import { RegisterStudentsDto } from '@/dtos/register-students.dto';
import { SuspendStudentDto } from '@/dtos/suspend-student.dto';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';
import NotificationUtils from '@/utils/notification';

@Injectable()
export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly studentRepository: StudentRepository,
    private readonly teacherStudentRepository: TeacherStudentRepository
  ) {}

  /**
   * Registers a list of students to a specified teacher.
   *
   * @param registerStudentsDto - Data transfer object containing the teacher's email
   *                              and the list of student emails to be registered.
   *
   * @throws {HttpException} - Throws an exception if the teacher is not found
   *                           or if any of the students are not found.
   */
  async registerStudents(registerStudentsDto: RegisterStudentsDto) {
    const { teacher: teacherEmail, students: studentEmails } =
      registerStudentsDto;

    // check if teacher exists
    const foundTeacher =
      await this.teacherRepository.findOneByEmail(teacherEmail);

    if (!foundTeacher) {
      throw new HttpException('Teacher not found', HttpStatus.BAD_REQUEST);
    }

    // check if all students exist
    const foundStudents =
      await this.studentRepository.findByEmails(studentEmails);
    if (foundStudents.length !== studentEmails.length) {
      throw new HttpException(
        'Some students not found',
        HttpStatus.BAD_REQUEST
      );
    }

    // save teacher-student relations
    const newTeacherStudents = foundStudents.map((student) => ({
      teacherId: foundTeacher.id,
      studentId: student.id,
    }));

    await this.teacherStudentRepository.save(newTeacherStudents);
  }

  /**
   * Retrieves a list of students common to all specified teachers.
   *
   * @param getCommonStudentsDto - Data transfer object containing an array of teacher emails.
   *
   * @returns A promise that resolves to an array of student emails who are common to all specified teachers.
   *
   * @throws {HttpException} - Throws an exception if any of the teachers are not found.
   */
  async getCommonStudents(getCommonStudentsDto: GetCommonStudentsDto) {
    const { teacher: teacherEmails } = getCommonStudentsDto;

    // check if all teachers exists
    const foundTeachers =
      await this.teacherRepository.findByEmails(teacherEmails);

    if (foundTeachers.length !== teacherEmails.length) {
      throw new HttpException(
        'Some teachers not found',
        HttpStatus.BAD_REQUEST
      );
    }

    // get common students
    const commonStudents =
      await this.studentRepository.getCommonStudents(foundTeachers);
    const commonStudentEmails = commonStudents.map((student) => student.email);

    return { students: commonStudentEmails };
  }

  async suspendStudent(suspendStudentDto: SuspendStudentDto) {
    const { student: studentEmail } = suspendStudentDto;

    // check if student exists
    const foundStudent =
      await this.studentRepository.findOneByEmail(studentEmail);

    if (!foundStudent) {
      throw new HttpException('Student not found', HttpStatus.BAD_REQUEST);
    }

    await this.studentRepository.suspendStudent(foundStudent);
  }

  async getNotificationReceivableStudents(
    getNotificationReceivableStudentsDto: GetNotificationReceivableStudentsDto
  ) {
    const { teacher: teacherEmail, notification } =
      getNotificationReceivableStudentsDto;

    const foundTeacher =
      await this.teacherRepository.findOneByEmail(teacherEmail);

    if (!foundTeacher) {
      throw new HttpException('Teacher not found', HttpStatus.BAD_REQUEST);
    }

    const mentionedStudentEmails =
      NotificationUtils.extractMentionedEmails(notification);

    const students =
      await this.studentRepository.getNotificationReceivableStudents(
        foundTeacher.id,
        mentionedStudentEmails
      );

    return {
      recipients: students.map((student) => student.email),
    };
  }
}
