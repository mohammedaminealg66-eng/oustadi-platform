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
  
  // State خاص بالمواد (كيخدم للأستاذ والتلميذ)
  const [subjects, setSubjects] = useState<any[]>([]);

  // State خاص ببيانات الأستاذ
  const [profileData, setProfileData] = useState({
    bio: '',
    hourlyPrice: 0,
    city: '',
    subjectId: ''
  });

  // States جداد خاصين ببحث التلميذ
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { router.push('/login'); return; }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      try {
        // 1. جلب بيانات المستخدم
        const resUser = await fetch(`${apiUrl}/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (resUser.ok) {
          const userData = await resUser.json();
          setUser(userData.user);
        } else {
          router.push('/login');
          return;
        }

        // 2. جلب المواد من الباكاند
        const resSubjects = await fetch(`${apiUrl}/subjects`);
        if (resSubjects.ok) {
          const subjectsData = await resSubjects.json();
          setSubjects(subjectsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // دالة جلب الأساتذة (خاصة بالتلميذ)
  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    try {
      const params = new URLSearchParams();
      if (searchCity) params.append('city', searchCity);
      if (searchSubject) params.append('subjectId', searchSubject);

      const res = await fetch(`${apiUrl}/teachers?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
      }
    } catch (error) {
      console.error("خطأ فجلب الأساتذة:", error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  // جلب الأساتذة أول مرة ملي كيدخل التلميذ
  useEffect(() => {
    if (user && user.role === 'STUDENT') {
      fetchTeachers();
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profileData.subjectId) {
      alert("المرجو اختيار المادة أولاً!");
      return;
    }

    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${apiUrl}/teachers/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          hourlyPrice: Number(profileData.hourlyPrice)
        }),
      });

      if (res.ok) {
        alert("تم تحديث معلوماتك بنجاح! دابا التلاميذ يقدرو يشوفوك.");
      } else {
        const errorData = await res.json();
        alert(`وقع مشكل فالحفظ: ${errorData.message || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error(error);
      alert("مشكل فالاتصال بالسيرفر");
    }
  };

  if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-blue-600">أستادي | Oustadi</h1>
          <Button onClick={() => { localStorage.removeItem('accessToken'); router.push('/login'); }} variant="outline">تسجيل الخروج</Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-3xl font-bold text-gray-800">مرحباً، {user.firstName} 👋</h2>
          <p className="text-gray-500 mt-2">دورك: <span className="font-bold text-blue-600">{user.role === 'TEACHER' ? 'أستاذ' : 'تلميذ'}</span></p>
        </div>

        {user.role === 'TEACHER' ? (
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
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>الثمن للساعة (DH)</Label>
                  <Input type="number" onChange={(e) => setProfileData({...profileData, hourlyPrice: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>المدينة</Label>
                  <Input type="text" onChange={(e) => setProfileData({...profileData, city: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>المادة</Label>
                  <select 
                    className="w-full p-2 border rounded-md h-10"
                    value={profileData.subjectId}
                    onChange={(e) => setProfileData({...profileData, subjectId: e.target.value})}
                  >
                    <option value="" disabled>اختر المادة...</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={handleSaveProfile} className="w-full bg-blue-600">حفظ المعلومات</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-t-4 border-t-green-500">
            <CardHeader>
              <CardTitle>البحث عن أستاذ</CardTitle>
              <CardDescription>قلب على الأستاذ المناسب ليك بالمدينة والمادة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* فلاتر البحث */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المدينة</Label>
                  <Input 
                    placeholder="مثال: الدار البيضاء" 
                    value={searchCity} 
                    onChange={(e) => setSearchCity(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>المادة</Label>
                  <select 
                    className="w-full p-2 border rounded-md h-10"
                    value={searchSubject}
                    onChange={(e) => setSearchSubject(e.target.value)}
                  >
                    <option value="">جميع المواد</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={fetchTeachers} className="w-full bg-green-600">بحث</Button>

              {/* نتائج البحث */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">النتائج ({teachers.length})</h3>
                {loadingTeachers ? (
                  <p className="text-center text-gray-500">جاري البحث...</p>
                ) : teachers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teachers.map((teacher) => (
                      <Card key={teacher.id} className="p-4 border shadow-sm hover:shadow-md transition">
                        <h4 className="font-bold text-lg">{teacher.user?.firstName} {teacher.user?.lastName}</h4>
                        <p className="text-sm text-blue-600 font-semibold">{teacher.subject?.name} - {teacher.city}</p>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{teacher.bio}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="font-bold">{teacher.hourlyPrice} درهم/ساعة</span>
                          <Button size="sm" variant="outline">طلب درس</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-6 border rounded-lg bg-gray-50">
                    مالقينا حتى أستاذ بهاد المواصفات حاليا.
                  </p>
                )}
              </div>

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}