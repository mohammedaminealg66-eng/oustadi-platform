import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
// زدنا هاد الجوج السطورا
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      message: "مرحباً بك في البروفايل ديالك المحمي!",
      user: req.user
    };
  }

  // ---- هادا هو الرابط الجديد باش نتيستيو الصلاحيات ----
  @UseGuards(AuthGuard('jwt'), RolesGuard) // حطينا جوج عساسة
  @Roles('ADMIN') // قلنا ليه هادا خاص غير بالأدمن
  @Get('admin-only')
  getAdminData() {
    return { message: "أهلاً بك أيها المدير، هادي بيانات سرية!" };
  }
}