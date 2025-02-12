import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';

describe('TeacherStudentRepository', () => {
  let teacherStudentRepository: TeacherStudentRepository;

  const mockCreateEntityManager = jest.fn();

  const mockDataSource = {
    createEntityManager: mockCreateEntityManager,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherStudentRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    teacherStudentRepository = module.get<TeacherStudentRepository>(
      TeacherStudentRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('TeacherStudentRepository', () => {
    it('should be defined', () => {
      expect(teacherStudentRepository).toBeDefined();
    });
  });
});
