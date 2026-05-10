import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // هنا كنقولو ليه منين غياخد التوكن (من الهيدر ديال الطلب)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // هاد الكلمة السرية خاصها تكون هي نيت اللي درتي فـ JwtModule فـ auth.module.ts
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key', 
    });
  }

  // هاد الدالة كتخدم أوتوماتيك ملي كيكون التوكن صحيح
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}