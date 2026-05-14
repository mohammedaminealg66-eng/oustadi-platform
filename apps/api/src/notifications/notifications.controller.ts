import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // تأكد من المسار ديال Guard

@UseGuards(JwtAuthGuard) // باش حتى واحد ما يشوف إشعارات لاخور
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Route: GET /notifications
  @Get()
  findAll(@Request() req) {
    // req.user.userId كنجيبوها من التوكن (JWT)
    return this.notificationsService.findAllForUser(req.user.userId);
  }

  // Route: PATCH /notifications/:id/read
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}