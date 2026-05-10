'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  // هادي هي الدالة اللي كتحبس المشاكل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // كتحبس الـ Refresh والـ GET
    e.stopPropagation(); // زيادة تأكيد الحماية
    
    setLoading(true);
    console.log("جاري إرسال البيانات:", formData);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('accessToken', data.access_token);
        alert("تم تسجيل الدخول بنجاح! 🎉");
        router.push('/dashboard'); 
      } else {
        const errorData = await res.json();
        alert("خطأ: " + (errorData.message || "معلومات غير صحيحة"));
      }
    } catch (error) {
      alert("مشكل في الاتصال بالباكاند! تأكد أن السيرفر شغال.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          {/* هاد السطر بالأحمر باش نتأكدو بلي الكود جديد */}
          <CardTitle className="text-2xl font-bold text-red-600 underline">Oustadi TEST V2</CardTitle>
          <CardDescription>أدخل معلوماتك للوصول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          {/* رد البال: الفورم هنا ما فيه لا method لا action */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" required onChange={handleChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" name="password" type="password" required onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white" disabled={loading}>
              {loading ? "جاري التحقق..." : "دخول"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟ <Link href="/register" className="text-blue-600 hover:underline">أنشئ حساباً</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}