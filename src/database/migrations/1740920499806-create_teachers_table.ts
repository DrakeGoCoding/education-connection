import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTeachersTable1740920499806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'teachers',
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
        ],
      })
    );

    await queryRunner.createIndex(
      'teachers',
      new TableIndex({
        name: 'TEACHERS_EMAIL_IDX',
        columnNames: ['email'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('teachers', 'TEACHERS_EMAIL_IDX');
    await queryRunner.dropTable('teachers');
  }
}
