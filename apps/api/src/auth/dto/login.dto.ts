import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'الإيميل غير صحيح' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'كلمة السر ضرورية' })
  password: string;
}