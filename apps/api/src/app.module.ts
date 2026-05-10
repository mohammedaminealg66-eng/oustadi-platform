import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service'; // استيراد الخدمة
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module'; // زيد هاد السطر

@Module({
  imports: [
    AuthModule, 
    TeachersModule, 
    SubjectsModule, // زيد هادي هنا
  ],
  // ...
})
export class AppModule {}