import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from '../prisma.service'; 
import { NotificationsService } from '../notifications/notifications.service'; 

@Module({
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService, NotificationsService],
})
export class RequestsModule {}