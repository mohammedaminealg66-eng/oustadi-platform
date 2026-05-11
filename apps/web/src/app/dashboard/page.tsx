'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  
  // هنا كنخبيو معلومات اليوزر اللي غنجيبوها من الباكاند
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. كنجبدو التوكن من المتصفح
      const token = localStorage.getItem('accessToken');
      
      // 2. إلى مالقيناش التوكن، كنرجعوه لصفحة الدخول بزز منو (Route Protection)
      if (!token) {
        router.push('/login');
        return;
      }

      // 3. إلى لقيناه، كنصيفطوه للباكاند باش يجيب لينا معلومات اليوزر
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // هادي هي الطريقة باش كنصيفطو الساروت للباكاند
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData); // كنخبيو المعلومات فـ State
        } else {
          // التوكن خاسر ولا سالات الصلاحية ديالو
          localStorage.removeItem('accessToken');
          router.push('/login');
        }
      } catch (error) {
        console.error("مشكل في جلب البيانات:", error);
      } finally {
        setLoading(false); // كنساليو اللودينغ
      }
    };

    fetchProfile();
  }, [router]);

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // كنمسحو الساروت
    router.push('/login'); // كنرجعوه لصفحة الدخول
  };

  // شاشة الانتظار بينما كنجيبو المعلومات
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-blue-600 animate-pulse">جاري تحميل بياناتك...</div>
      </div>
    );
  }

  // إلى مكانش اليوزر، المتصفح غيدير ليه Redirect فـ useEffect
  if (!user) return null; 

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* شريط التنقل (Navbar بسيط) */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-blue-600">أستادي | Oustadi</h1>
          <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            تسجيل الخروج
          </Button>
        </div>

        {/* رسالة الترحيب */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-3xl font-bold text-gray-800">
            مرحباً، {user.firstName} {user.lastName} 👋
          </h2>
          <p className="text-gray-500 mt-2">
            دورك في المنصة: <span className="font-semibold text-blue-600">{user.role === 'TEACHER' ? 'أستاذ' : 'تلميذ'}</span>
          </p>
        </div>

        {/* الواجهة كتتبدل على حساب الدور (Role-based UI) */}
        {user.role === 'TEACHER' ? (
          <Card className="border-t-4 border-t-blue-500 shadow-md">
            <CardHeader>
              <CardTitle>لوحة تحكم الأستاذ</CardTitle>
              <CardDescription>إعداد الملف الشخصي واستقبال طلبات التلاميذ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800">
                <p>ملفك الشخصي غير مكتمل بعد. يرجى إضافة المواد التي تدرسها، أوقات فراغك، وثمن الحصة حتى يتمكن التلاميذ من إيجادك في البحث.</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
                إكمال الملف الشخصي (قريباً)
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-t-4 border-t-green-500 shadow-md">
            <CardHeader>
              <CardTitle>لوحة تحكم التلميذ</CardTitle>
              <CardDescription>البحث عن الأساتذة وطلب حصص الدعم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-green-800">
                <p>مرحباً بك في منصة أستادي. يمكنك الآن البحث عن أفضل الأساتذة ومراسلتهم لحجز حصتك القادمة.</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto">
                ابحث عن أستاذ (قريباً)
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}