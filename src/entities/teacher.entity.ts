import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Student } from './student.entity';
import { TeacherStudent } from './teacher-student.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column('varchar', {
    name: 'email',
    length: 255,
    nullable: false,
    unique: true,
  })
  @Index('TEACHERS_EMAIL_IDX', { unique: true })
  email: string;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
  students?: Student[];
}
