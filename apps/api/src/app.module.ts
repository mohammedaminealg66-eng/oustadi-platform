import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service'; // استيراد الخدمة
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [AuthModule, TeachersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService], // إضافة PrismaService هنا
})
export class AppModule {}