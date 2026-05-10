'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // كنشوفو واش كاين التوكن في المتصفح
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      // إلا مكانش التوكن، رجعو لصفحة تسجيل الدخول
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    // مسح التوكن ورجعو للـ Login
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحقق...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar بسيط */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">منصة أستادي - لوحة التحكم</h1>
        <Button variant="outline" onClick={handleLogout}>
          تسجيل الخروج
        </Button>
      </nav>

      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>مرحباً بك في حسابك</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                لقد قمت بتسجيل الدخول بنجاح. هادي هي البلاصة فين غتلقى الدروس ديالك مستقبلاً.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}