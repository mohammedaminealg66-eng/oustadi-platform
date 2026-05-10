import { Body, Controller, Post, Get, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('admin-only')
  getAdminData() {
    return { message: "أهلاً بك أيها المدير، هادي بيانات سرية!" };
  }

  // ---- الرابط الجديد لرفع الصورة الشخصية ----
  @Post('upload-avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile-images',
      filename: (req, file, cb) => {
        // توليد اسم عشوائي للصورة باش ما يتغالطوش
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    const imageUrl = `/uploads/profile-images/${file.filename}`;
    // تحديث رابط الصورة في قاعدة البيانات للمستخدم الحالي
    await this.authService.updateProfileImage(req.user.userId, imageUrl);
    return {
      message: "تم رفع الصورة بنجاح",
      url: imageUrl
    };
  }
}