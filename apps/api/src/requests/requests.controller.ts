import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // هادي هي الصحيحة عندك
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  createRequest(@Request() req, @Body('teacherId') teacherId: string) {
    return this.requestsService.createRequest(req.user.userId, teacherId);
  }

  @Get()
  getRequests(@Request() req) {
    return this.requestsService.getRequests(req.user.userId, req.user.role);
  }

  @Patch(':id')
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: 'ACCEPTED' | 'REJECTED',
  ) {
    return this.requestsService.updateRequestStatus(id, req.user.userId, status);
  }
}