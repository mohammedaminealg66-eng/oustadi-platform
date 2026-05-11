import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // تفعيل التحقق من البيانات (Validation)
  app.useGlobalPipes(new ValidationPipe());
  
  // تفعيل Cors باش الفورانتاند يقدر يهضر مع الباكاند
  app.enableCors();

await app.listen(3001, '0.0.0.0');
}
bootstrap();