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
  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({ bio: '', hourlyPrice: 0, city: '', subjectId: '' });

  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const [requests, setRequests] = useState<any[]>([]);
  
  // State جديد ديال المفضلة
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { router.push('/login'); return; }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      try {
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

        const resSubjects = await fetch(`${apiUrl}/subjects`);
        if (resSubjects.ok) setSubjects(await resSubjects.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

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
      if (res.ok) setTeachers(await res.json());
    } catch (error) {
      console.error("خطأ فجلب الأساتذة:", error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const fetchRequests = async () => {
    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      const res = await fetch(`${apiUrl}/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setRequests(await res.json());
    } catch (error) {}
  };

  // دالة جلب المفضلة
  const fetchFavorites = async () => {
    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      const res = await fetch(`${apiUrl}/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setFavorites(await res.json());
    } catch (error) {}
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'STUDENT') {
        fetchTeachers();
        fetchFavorites(); // كنجيبو المفضلة غير للتلميذ
      }
      fetchRequests(); 
    }
  }, [user]);

  const handleSendRequest = async (teacherUserId: string) => {
    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      const res = await fetch(`${apiUrl}/requests`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: teacherUserId })
      });
      if (res.ok) {
        alert("تم إرسال الطلب للأستاذ بنجاح!");
        fetchRequests();
      } else {
        alert("وقع مشكل فإرسال الطلب.");
      }
    } catch (error) {}
  };

  const handleUpdateRequest = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      const res = await fetch(`${apiUrl}/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchRequests();
    } catch (error) {}
  };

  // دالة إضافة/إزالة من المفضلة
  const handleToggleFavorite = async (teacherProfileId: string) => {
    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      const res = await fetch(`${apiUrl}/favorites`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherProfileId })
      });
      if (res.ok) fetchFavorites(); // تحديث اللائحة بعد الإضافة/الإزالة
    } catch (error) {}
  };

  const getStatusText = (status: string) => {
    if (status === 'PENDING') return <span className="text-yellow-600 font-bold">قيد الانتظار ⏳</span>;
    if (status === 'ACCEPTED') return <span className="text-green-600 font-bold">مقبول ✅</span>;
    if (status === 'REJECTED') return <span className="text-red-600 font-bold">مرفوض ❌</span>;
    return status;
  };

  if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-blue-600">أستادي | Oustadi</h1>
          <Button onClick={() => { localStorage.removeItem('accessToken'); router.push('/login'); }} variant="outline">تسجيل الخروج</Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-3xl font-bold text-gray-800">مرحباً، {user.firstName} 👋</h2>
          <p className="text-gray-500 mt-2">دورك: <span className="font-bold text-blue-600">{user.role === 'TEACHER' ? 'أستاذ' : 'تلميذ'}</span></p>
        </div>

        {user.role === 'TEACHER' ? (
          <div className="space-y-6">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader><CardTitle>إكمال الملف المهني</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">هاد المعلومات كاتعاون التلاميذ يلقاوك. (دير حفظ باش تبان)</div>
                <Button variant="outline" className="w-full">تحديث الملف الشخصي (مخفي مؤقتاً لتصغير الكود)</Button>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <CardTitle>طلبات الدروس ({requests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? <p className="text-gray-500">ماكاين حتى طلب حالياً.</p> : (
                  <div className="space-y-4">
                    {requests.map((req) => (
                      <div key={req.id} className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg bg-gray-50">
                        <div>
                          <p className="font-bold">{req.student?.firstName} {req.student?.lastName}</p>
                          <p className="mt-1 text-sm">{getStatusText(req.status)}</p>
                        </div>
                        {req.status === 'PENDING' && (
                          <div className="flex gap-2 mt-4 md:mt-0">
                            <Button onClick={() => handleUpdateRequest(req.id, 'ACCEPTED')} className="bg-green-600 hover:bg-green-700">قبول</Button>
                            <Button onClick={() => handleUpdateRequest(req.id, 'REJECTED')} variant="destructive">رفض</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle>البحث عن أستاذ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>المدينة</Label>
                    <Input placeholder="مثال: الدار البيضاء" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>المادة</Label>
                    <select className="w-full p-2 border rounded-md h-10" value={searchSubject} onChange={(e) => setSearchSubject(e.target.value)}>
                      <option value="">جميع المواد</option>
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button onClick={fetchTeachers} className="w-full bg-green-600 hover:bg-green-700">بحث</Button>

                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4">النتائج ({teachers.length})</h3>
                  {loadingTeachers ? <p className="text-gray-500">جاري البحث...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teachers.map((teacher) => {
                        // كنفحصو واش الأستاذ كاين فالمفضلة
                        const isFavorite = favorites.some(fav => fav.teacherProfileId === teacher.id);
                        
                        return (
                          <Card key={teacher.id} className="p-4 border shadow-sm relative">
                            {/* بوطونة المفضلة */}
                            <button 
                              onClick={() => handleToggleFavorite(teacher.id)}
                              className="absolute top-4 left-4 text-2xl hover:scale-110 transition-transform"
                              title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                            >
                              {isFavorite ? '❤️' : '🤍'}
                            </button>

                            <h4 className="font-bold text-lg pr-8">{teacher.user?.firstName} {teacher.user?.lastName}</h4>
                            <p className="text-sm text-blue-600 font-semibold">{teacher.subject?.name} - {teacher.city}</p>
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{teacher.bio}</p>
                            <div className="mt-4 flex justify-between items-center">
                              <span className="font-bold">{teacher.hourlyPrice} درهم/ساعة</span>
                              <Button size="sm" onClick={() => handleSendRequest(teacher.userId)}>طلب درس</Button>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* قسم أساتذتي المفضلين (الجديد) */}
            <Card className="border-t-4 border-t-pink-500">
              <CardHeader>
                <CardTitle>أساتذتي المفضلين ❤️ ({favorites.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? <p className="text-gray-500">مازال ما ضفتي حتى أستاذ للمفضلة.</p> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                      <Card key={fav.id} className="p-4 border shadow-sm bg-pink-50/30 relative">
                         <button 
                              onClick={() => handleToggleFavorite(fav.teacherProfileId)}
                              className="absolute top-4 left-4 text-2xl hover:scale-110 transition-transform"
                              title="إزالة من المفضلة"
                            >
                              ❤️
                            </button>
                        <h4 className="font-bold">{fav.teacherProfile?.user?.firstName} {fav.teacherProfile?.user?.lastName}</h4>
                        <p className="text-sm text-gray-600">{fav.teacherProfile?.subject?.name} - {fav.teacherProfile?.city}</p>
                        <Button className="mt-4 w-full" size="sm" onClick={() => handleSendRequest(fav.teacherProfile?.user?.id)}>طلب درس</Button>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <CardTitle>طلباتي ({requests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? <p className="text-gray-500">مازال ما صيفطتي حتى طلب.</p> : (
                  <div className="space-y-4">
                    {requests.map((req) => (
                      <div key={req.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                        <div>
                          <p className="font-bold">الأستاذ: {req.teacher?.firstName} {req.teacher?.lastName}</p>
                        </div>
                        <div>{getStatusText(req.status)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}