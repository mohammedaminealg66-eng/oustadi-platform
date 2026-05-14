import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaService } from '../prisma.service'; // المسار الصحيح

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService], // زدنا Prisma هنا
})
export class FavoritesModule {}