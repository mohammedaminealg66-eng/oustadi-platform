import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../prisma/prisma.module'; // تأكد بلي راك داير import لـ Prisma

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService], // 👈 هادي مهمة بزاف باش نقدرو نعيطو ليه من RequestsModule
})
export class NotificationsModule {}