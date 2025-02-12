import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { Student } from '@/entities/student.entity';
import { TeacherStudent } from '@/entities/teacher-student.entity';
import { Teacher } from '@/entities/teacher.entity';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  /**
   * Finds a student by their email.
   *
   * @param email - Student's email.
   *
   * @returns The student with the given email, or null if not found.
   */
  findOneByEmail(email: string): Promise<Student | null> {
    return this.findOne({ where: { email } });
  }

  /**
   * Finds students by their email addresses.
   *
   * @param emails - An array of student email addresses to search for.
   *
   * @returns A promise that resolves to an array of students with the given emails.
   */
  findByEmails(emails: string[]): Promise<Student[]> {
    return this.findBy({ email: In(emails) });
  }

  /**
   * Finds the students that are common to all the given teachers.
   *
   * @param teachers - An array of teachers to search for.
   *
   * @returns A promise that resolves to an array of students that are common
   *          to all the given teachers.
   */
  getCommonStudents(teachers: Teacher[]): Promise<Student[]> {
    return this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(Student, 's')
      .innerJoin(
        (subQuery) =>
          subQuery
            // select all columns from the `TeacherStudent` table
            .select('*')
            .from(TeacherStudent, 'ts')
            // filter the results based on the `teacher_id` being in the array of `teachers`
            .where(`ts.teacher_id IN (:teacherIds)`, {
              teacherIds: teachers.map((t) => t.id).join(','),
            })
            // group the results by `student_id`
            .groupBy('ts.student_id')
            // filter the groups to only include those with a count equal to the number of `teachers`
            .having(`COUNT(ts.student_id) = :count`, {
              count: teachers.length,
            }),
        'subQuery',
        'subQuery.student_id = s.id'
      )
      .execute();
  }
}
