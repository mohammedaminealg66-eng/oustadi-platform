import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('TEACHER')
  @Post('profile')
  createProfile(@Request() req: any, @Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.createOrUpdateProfile(req.user.userId, createTeacherDto);
  }

  // جلب الأساتذة مع إمكانية البحث والفلترة
  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('subjectId') subjectId?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.teachersService.findAll({ 
      city, 
      subjectId, 
      minPrice, 
      maxPrice 
    });
  }
}