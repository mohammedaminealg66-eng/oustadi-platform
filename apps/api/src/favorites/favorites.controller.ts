import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // حماية الطريق
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // POST /favorites (للإضافة أو الإزالة)
  @Post()
  toggleFavorite(@Request() req, @Body('teacherProfileId') teacherProfileId: string) {
    return this.favoritesService.toggleFavorite(req.user.userId, teacherProfileId);
  }

  // GET /favorites (لجلب اللائحة)
  @Get()
  getFavorites(@Request() req) {
    return this.favoritesService.getFavorites(req.user.userId);
  }
}