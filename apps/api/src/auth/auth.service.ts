import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new HttpException('هذا البريد الإلكتروني مستعمل من قبل', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.prisma.user.create({
      // السطر اللي زدنا هنا هو "role: data.role" باش نحترم اختيار المستخدم
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: data.role, 
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      message: 'تم التسجيل بنجاح',
      user: userWithoutPassword,
    };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new HttpException('البريد الإلكتروني أو كلمة السر غير صحيحة', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('البريد الإلكتروني أو كلمة السر غير صحيحة', HttpStatus.UNAUTHORIZED);
    }

    // هنا الـ payload ديجا فيه الـ role، هادشي مزيان
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'تم تسجيل الدخول بنجاح',
      access_token: token,
      user: userWithoutPassword,
    };
  }
}