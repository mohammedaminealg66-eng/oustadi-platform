import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
@UseGuards(AuthGuard('jwt'))
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('profile')
  updateProfile(@Request() req: any, @Body() dto: UpdateStudentDto) {
    return this.studentsService.updateProfile(req.user.userId, dto);
  }

  @Post('favorites/:teacherId')
  toggleFavorite(@Request() req: any, @Param('teacherId') teacherId: string) {
    return this.studentsService.toggleFavorite(req.user.userId, teacherId);
  }

  @Get('favorites')
  getFavorites(@Request() req: any) {
    return this.studentsService.getFavorites(req.user.userId);
  }
}