import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport'; // باش نأمنو الروت

@UseGuards(AuthGuard('jwt')) // 👈 حماية الروت، خاص المستخدم يكون مكونيكطي
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getUserNotifications(@Request() req) {
    // كنجبدو الـ id ديال المستخدم من التوكين
    const userId = req.user.userId || req.user.id || req.user.sub; 
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}