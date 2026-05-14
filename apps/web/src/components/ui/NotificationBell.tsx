"use client";

import { useState, useEffect } from 'react';
import { getNotifications, markNotificationAsRead } from '@/lib/notificationsApi';

// هادي باش نحددو الشكل ديال الإشعار
interface Notification {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell({ token }: { token: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // نجيبو الإشعارات فاش يتحل الكومبوننت
  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(token);
      setNotifications(data);
    } catch (error) {
      console.error("مشكل في جلب الإشعارات:", error);
    }
  };

  const handleRead = async (id: string, isRead: boolean) => {
    if (isRead) return; // إيلا كان مقروء بلا مانعاودو نصيفطو للباكاند
    try {
      await markNotificationAsRead(id, token);
      // نحدثو اللائحة باش يولي الإشعار مقروء فـ الفرانتد
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("مشكل في تحديث الإشعار:", error);
    }
  };

  // نحسبو شحال من إشعار مازال ما تقرأش
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      {/* زر الجرس */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-green-600 focus:outline-none transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>

        {/* النقطة الحمراء ديال عدد الإشعارات */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* اللائحة المنسدلة (Dropdown) ديال الإشعارات */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
            الإشعارات
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                ماعندك حتى إشعار حاليا.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleRead(notif.id, notif.isRead)}
                  className={`px-4 py-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                    !notif.isRead ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'bg-white'
                  }`}
                  dir="rtl"
                >
                  <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                    {notif.content}
                  </p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(notif.createdAt).toLocaleDateString('ar-MA')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}