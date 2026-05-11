'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  
  // State لتخزين بيانات المستخدم
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. جلب التوكن من localStorage
      const token = localStorage.getItem('accessToken');
      
      // 2. حماية الصفحة: إذا لم يوجد توكن، ارجع لصفحة تسجيل الدخول
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        // 3. طلب بيانات البروفايل من الباكاند
        const res = await fetch(`${apiUrl}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const userData = await res.json();
          
          // --- السطر المهم للتشخيص ---
          console.log("المعلومات اللي جات من الباكاند:", userData);
          // --------------------------

          setUser(userData); 
        } else {
          // إذا كان التوكن غير صالح أو منتهي الصلاحية
          console.error("فشل في جلب البيانات، التوكن قد يكون غير صالح");
          localStorage.removeItem('accessToken');
          router.push('/login');
        }
      } catch (error) {
        console.error("مشكل في الاتصال بالباكاند:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  // حالة التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-blue-600 animate-pulse">جاري تحميل بياناتك...</div>
      </div>
    );
  }

  // إذا لم تنجح عملية جلب اليوزر
  if (!user) return null; 

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header / Navbar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-blue-600">أستادي | Oustadi</h1>
          <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            تسجيل الخروج
          </Button>
        </div>

        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-3xl font-bold text-gray-800">
            مرحباً، {user.firstName || ''} {user.lastName || ''} 👋
          </h2>
          <p className="text-gray-500 mt-2">
            دورك في المنصة: <span className="font-semibold text-blue-600">
              {user.role === 'TEACHER' ? 'أستاذ' : 'تلميذ'}
            </span>
          </p>
        </div>

        {/* Role-based Dashboard Content */}
        {user.role === 'TEACHER' ? (
          <Card className="border-t-4 border-t-blue-500 shadow-md">
            <CardHeader>
              <CardTitle>لوحة تحكم الأستاذ</CardTitle>
              <CardDescription>هنا ستدير ملفك الشخصي وطلبات التلاميذ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800">
                <p>ملفك الشخصي غير مكتمل. أضف المواد والأسعار ليراك التلاميذ.</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                تعديل معلومات البروفايل
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-t-4 border-t-green-500 shadow-md">
            <CardHeader>
              <CardTitle>لوحة تحكم التلميذ</CardTitle>
              <CardDescription>ابحث عن أستاذك وابدأ التعلم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-green-800">
                <p>مرحباً بك! يمكنك الآن البحث عن الأساتذة حسب المادة أو المدينة.</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                البحث عن أستاذ (قريباً)
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}