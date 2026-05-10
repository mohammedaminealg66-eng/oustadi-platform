import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // كنجبدو الصلاحيات المطلوبة من داك الختم لي حطينا فوق الرابط
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // إيلا الرابط مافيهش الختم، خليه يدخل
    if (!requiredRoles) {
      return true;
    }
    
    // كنجبدو المستخدم من الطلب
    const { user } = context.switchToHttp().getRequest();
    
    // كنتأكدو واش الرتبة ديالو كاينة ضمن الصلاحيات المطلوبة
    return requiredRoles.some((role) => user?.role?.includes(role));
  }
}