import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from '../prisma.service'; // المسار الصحيح

@Module({
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService], // زدناها نيشان هنا
})
export class RequestsModule {}