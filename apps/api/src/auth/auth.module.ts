import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'OUSTADI_SUPER_SECRET_KEY_123', // من بعد غنردوها فـ .env باش تكون سيكوريزي
      signOptions: { expiresIn: '7d' }, // الساروت كيسالي الصلاحية ديالو من بعد 7 أيام
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}