import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // مسار بريزما الصحيح عندك

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  // دالة الإضافة والإزالة (Toggle)
  async toggleFavorite(userId: string, teacherProfileId: string) {
    // كنقلبو واش التلميذ ديجا داير هاد الأستاذ فالمفضلة
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_teacherProfileId: {
          userId,
          teacherProfileId,
        },
      },
    });

    if (existingFavorite) {
      // إيلا لقاه، كيحيدو (Remove)
      await this.prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      return { message: 'تمت الإزالة من المفضلة', isFavorite: false };
    } else {
      // إيلا مالقاهش، كيزيدو (Add)
      await this.prisma.favorite.create({
        data: {
          userId,
          teacherProfileId,
        },
      });
      return { message: 'تمت الإضافة إلى المفضلة', isFavorite: true };
    }
  }

  // دالة جلب قائمة المفضلة ديال تلميذ معين
  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        teacherProfile: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            subject: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}