import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  // هاد الدالة كتصاوب بروفايل للأستاذ، وإيلا كان ديجا عندو كدير ليه التحديث (upsert)
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

  // هاد الدالة كتجيب كاع الأساتذة مع المعلومات ديالهم
  findAll() {
    return this.prisma.teacherProfile.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, profileImage: true, email: true }
        },
        subject: true,
      }
    });
  }
}