import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'الإيميل غير صحيح' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'كلمة السر يجب أن تحتوي على 6 أحرف على الأقل' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'الاسم الشخصي ضروري' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'الاسم العائلي ضروري' })
  lastName: string;
}