import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { PrismaService } from '../prisma.service'; // زدنا هادي

@Module({
  controllers: [TeachersController],
  providers: [TeachersService, PrismaService], // وزدناها هنا
})
export class TeachersModule {}