import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // المسار الصحيح
import { NotificationsService } from '../notifications/notifications.service'; // 👈 زدنا هادي

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService // 👈 دخلناها هنا
  ) {}

  async createRequest(studentId: string, teacherId: string) {
    // 1. كريي الطلب
    const request = await this.prisma.lessonRequest.create({
      data: {
        studentId,
        teacherId,
      },
    });

    // 2. صيفط إشعار للأستاذ
    await this.notificationsService.createNotification(
      teacherId,
      'عندك طلب درس جديد من تلميذ! 📚'
    );

    return request;
  }

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

  async updateRequestStatus(requestId: string, teacherId: string, status: 'ACCEPTED' | 'REJECTED') {
    const request = await this.prisma.lessonRequest.findUnique({ where: { id: requestId } });
    
    if (!request || request.teacherId !== teacherId) {
      throw new UnauthorizedException("ماعندكش الصلاحية تبدل هاد الطلب");
    }

    // 1. بدل حالة الطلب
    const updatedRequest = await this.prisma.lessonRequest.update({
      where: { id: requestId },
      data: { status },
    });

    // 2. صيفط إشعار للتلميذ
    const statusText = status === 'ACCEPTED' ? 'مقبول ✅' : 'مرفوض ❌';
    await this.notificationsService.createNotification(
      request.studentId, // كنصيفطوه للتلميذ اللي دار الطلب
      `تم تحديث حالة طلبك إلى: ${statusText}`
    );

    return updatedRequest;
  }
}