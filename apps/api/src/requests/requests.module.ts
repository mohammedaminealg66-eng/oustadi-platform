import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { NotificationsModule } from '../notifications/notifications.module'; // 👈 هادي

@Module({
  imports: [NotificationsModule], // 👈 وهادي
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}