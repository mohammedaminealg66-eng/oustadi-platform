import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateProfile(userId: string, dto: CreateTeacherDto) {
    return this.prisma.teacherProfile.upsert({
      where: { userId },
      update: {
        bio: dto.bio,
        hourlyPrice: dto.hourlyPrice,
        city: dto.city,
        subjectId: dto.subjectId,
      },
      create: {
        userId,
        bio: dto.bio,
        hourlyPrice: dto.hourlyPrice,
        city: dto.city,
        subjectId: dto.subjectId,
      },
    });
  }

  // الدالة مطورة باش تقبل الفلترة
  async findAll(query: { city?: string; subjectId?: string; minPrice?: number; maxPrice?: number }) {
    return this.prisma.teacherProfile.findMany({
      where: {
        // الفلترة بالمدينة والمادة (إيلا وجدوا)
        city: query.city || undefined,
        subjectId: query.subjectId || undefined,
        // الفلترة بمجال الثمن
        hourlyPrice: {
          gte: query.minPrice ? Number(query.minPrice) : undefined,
          lte: query.maxPrice ? Number(query.maxPrice) : undefined,
        },
      },
      include: {
        user: {
          select: { 
            firstName: true, 
            lastName: true, 
            profileImage: true, 
            email: true 
          }
        },
        subject: true,
      }
    });
  }
}