import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // تأكد من مسار Prisma

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // هادي ديجا هضرنا عليها باش نكرييو إشعار
  async createNotification(userId: string, content: string) {
    return this.prisma.notification.create({
      data: { userId, content },
    });
  }

  // 👈 هادي اللي ناقصانا باش نجيبو الإشعارات
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // باش يبان الجديد هو الأول
    });
  }

  // 👈 وهادي باش نردّو الإشعار "مقروء"
  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}