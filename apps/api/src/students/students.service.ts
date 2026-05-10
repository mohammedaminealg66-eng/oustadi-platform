import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, dto: UpdateStudentDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { city: dto.city },
    });
  }

  async toggleFavorite(userId: string, teacherProfileId: string) {
    const existing = await this.prisma.favorite.findFirst({
      where: { userId, teacherProfileId },
    });
    if (existing) {
      return this.prisma.favorite.delete({ where: { id: existing.id } });
    }
    return this.prisma.favorite.create({
      data: { userId, teacherProfileId },
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        teacherProfile: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImage: true } },
            subject: true,
          },
        },
      },
    });
  }
}