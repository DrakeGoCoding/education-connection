import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateStudentsTable1740921136148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'students',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'is_suspended',
            type: 'boolean',
            default: false,
          },
        ],
      })
    );

    await queryRunner.createIndex(
      'students',
      new TableIndex({
        name: 'STUDENTS_EMAIL_IDX',
        columnNames: ['email'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('students', 'STUDENTS_EMAIL_IDX');
    await queryRunner.dropTable('students');
  }
}
