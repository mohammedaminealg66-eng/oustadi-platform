import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // تأكد من مسار PrismaService على حساب مشروعك

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // هادي غنعيطو ليها فاش نبغيو نصيفطو إشعار لشي واحد
  async createNotification(userId: string, content: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        content,
      },
    });
  }

  // هادي باش نجيبو الإشعارات ديال مستخدم محدد (مرتبين من الجديد للقديم)
  async findAllForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // هادي باش نردّو إشعار بلي "تمت قراءته"
  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}