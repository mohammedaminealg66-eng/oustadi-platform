import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // 1. الأستاذ كيقاد البروفايل ديالو (هاد الرابط محمي وخاص غير بالأساتذة)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('TEACHER')
  @Post('profile')
  createProfile(@Request() req: any, @Body() createTeacherDto: CreateTeacherDto) {
    // كنجبدو الـ ID ديال المستخدم مباشرة من التوكن (أمان كتر)
    return this.teachersService.createOrUpdateProfile(req.user.userId, createTeacherDto);
  }

  // 2. جلب كاع الأساتذة (مفتوح للعموم باش التلامذ يقلبو)
  @Get()
  findAll() {
    return this.teachersService.findAll();
  }
}