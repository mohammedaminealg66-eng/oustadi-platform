import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from '../prisma.service'; // هادا هو السطر الصحيح

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
})
export class NotificationsModule {}