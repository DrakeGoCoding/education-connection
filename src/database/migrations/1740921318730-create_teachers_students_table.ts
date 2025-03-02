import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTeachersStudentsTable1740921318730
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'teachers_students',
        columns: [
          {
            name: 'teacher_id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'student_id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('teachers_students');
  }
}
