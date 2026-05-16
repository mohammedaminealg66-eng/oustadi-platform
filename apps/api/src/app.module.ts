import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StudentsModule } from './students/students.module'; // 1. هادي راك زدتيها مزيان
import { RequestsModule } from './requests/requests.module';
import { FavoritesModule } from './favorites/favorites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule, 
    TeachersModule, 
    SubjectsModule,
    StudentsModule,
    RequestsModule,
    FavoritesModule,
    NotificationsModule, // 2. هادي هي اللي كانت ناقصاك وسط المصفوفة
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}