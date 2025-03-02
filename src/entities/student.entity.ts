import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TeacherStudent } from './teacher-student.entity';
import { Teacher } from './teacher.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column('varchar', {
    name: 'email',
    length: 255,
    nullable: false,
    unique: true,
  })
  @Index('STUDENTS_EMAIL_IDX', { unique: true })
  email: string;

  @Column({ name: 'is_suspended', type: 'boolean', default: false })
  isSuspended: boolean;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
  teachers?: Teacher[];
}
