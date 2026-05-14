import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  // 1. تلميذ كيصيفط طلب لشي أستاذ
  async createRequest(studentId: string, teacherId: string) {
    return this.prisma.lessonRequest.create({
      data: {
        studentId,
        teacherId,
      },
    });
  }

  // 2. جلب الطلبات (للأستاذ باش يشوف شكون طلبو، وللتلميذ باش يشوف طلباتو)
  async getRequests(userId: string, role: string) {
    if (role === 'TEACHER') {
      return this.prisma.lessonRequest.findMany({
        where: { teacherId: userId },
        include: { student: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      return this.prisma.lessonRequest.findMany({
        where: { studentId: userId },
        include: { teacher: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  // 3. أستاذ كيقبل أو كيرفض الطلب
  async updateRequestStatus(requestId: string, teacherId: string, status: 'ACCEPTED' | 'REJECTED') {
    const request = await this.prisma.lessonRequest.findUnique({ where: { id: requestId } });
    
    if (!request || request.teacherId !== teacherId) {
      throw new UnauthorizedException("ماعندكش الصلاحية تبدل هاد الطلب");
    }

    return this.prisma.lessonRequest.update({
      where: { id: requestId },
      data: { status },
    });
  }
}