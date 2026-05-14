// apps/web/src/lib/notificationsApi.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getNotifications = async (token: string) => {
  const response = await fetch(`${API_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('فشل في جلب الإشعارات');
  return response.json();
};

export const markNotificationAsRead = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('فشل في تحديث الإشعار');
  return response.json();
};