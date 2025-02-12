import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database.module';
import { TeacherModule } from './teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TeacherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
