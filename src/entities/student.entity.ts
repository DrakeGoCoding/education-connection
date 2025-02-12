import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  email: string;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
  teachers?: Teacher[];
}
