'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State خاص ببيانات البروفايل للأستاذ
  const [profileData, setProfileData] = useState({
    bio: '',
    hourlyPrice: 0,
    city: '',
    subjectId: '' // هادي خاصها ID ديال المادة من الداتابيس
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { router.push('/login'); return; }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/auth/profile`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  // دالة حفظ بيانات الأستاذ
  const handleSaveProfile = async () => {
    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${apiUrl}/teachers/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        alert("تم تحديث معلوماتك بنجاح! دابا التلاميذ يقدرو يشوفوك.");
      } else {
        alert("وقع مشكل فالحفظ.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-blue-600">أستادي | Oustadi</h1>
          <Button onClick={() => { localStorage.removeItem('accessToken'); router.push('/login'); }} variant="outline">تسجيل الخروج</Button>
        </div>

        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-3xl font-bold text-gray-800">مرحباً، {user.firstName} 👋</h2>
          <p className="text-gray-500 mt-2">دورك: <span className="font-bold text-blue-600">{user.role === 'TEACHER' ? 'أستاذ' : 'تلميذ'}</span></p>
        </div>

        {/* Content للأستاذ */}
        {user.role === 'TEACHER' ? (
          <div className="space-y-6">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle>إكمال الملف المهني</CardTitle>
                <CardDescription>عمر هاد المعلومات باش تبان فالبحث</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>نبذة عنك (Bio)</Label>
                  <textarea 
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    placeholder="مثال: أستاذ رياضيات بخبرة 5 سنوات..."
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الثمن للساعة (DH)</Label>
                    <Input type="number" onChange={(e) => setProfileData({...profileData, hourlyPrice: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>المدينة</Label>
                    <Input type="text" placeholder="الدار البيضاء" onChange={(e) => setProfileData({...profileData, city: e.target.value})} />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="w-full bg-blue-600">حفظ المعلومات</Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Content للتلميذ */
          <Card className="border-t-4 border-t-green-500">
            <CardHeader><CardTitle>لوحة تحكم التلميذ</CardTitle></CardHeader>
            <CardContent>
              <Button className="bg-green-600">البحث عن أستاذ (قريباً)</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}