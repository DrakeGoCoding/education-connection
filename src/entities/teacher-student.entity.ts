import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Student } from './student.entity';
import { Teacher } from './teacher.entity';

@Entity('teachers_students')
export class TeacherStudent {
  @PrimaryColumn({ name: 'teacher_id', type: 'int' })
  teacherId: number;

  @PrimaryColumn({ name: 'student_id', type: 'int' })
  studentId: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.students)
  @JoinColumn([{ name: 'teacher_id', referencedColumnName: 'id' }])
  teacher?: Teacher;

  @ManyToOne(() => Student, (student) => student.teachers)
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student?: Student;
}
