import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // تأكد من مسار الـ Guard

@UseGuards(JwtAuthGuard) // كاع هاد الطرق خاص يكون خونا مكونيكطي
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // POST /requests (إرسال طلب)
  @Post()
  createRequest(@Request() req, @Body('teacherId') teacherId: string) {
    return this.requestsService.createRequest(req.user.userId, teacherId);
  }

  // GET /requests (جلب الطلبات)
  @Get()
  getRequests(@Request() req) {
    return this.requestsService.getRequests(req.user.userId, req.user.role);
  }

  // PATCH /requests/:id (قبول أو رفض)
  @Patch(':id')
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: 'ACCEPTED' | 'REJECTED',
  ) {
    return this.requestsService.updateRequestStatus(id, req.user.userId, status);
  }
}