'use client'; // هادي ضرورية حيت غنستعملو تفاعل المستخدم (كتابة، كليك)

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // باش نحولو المستخدم لصفحة أخرى
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  // 1. هنا كنخبيو المعلومات اللي كيكتبها المستخدم
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT', // غادي نعتبروه تلميذ كبداية
  });

  // 2. هاد الدالة كتحدث المعلومات كلما كتب شي حرف فشي خانة
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. هاد الدالة كتخدم فاش كنكليكيو على "إنشاء حساب"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // باش الصفحة ماديرش ريفريش
    
    try {
      // كنصيفطو المعلومات للباكاند ديالنا (NestJS) اللي خدام فـ 3000
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // كنحولو المعلومات لـ JSON
      });

      if (res.ok) {
        alert("تم إنشاء الحساب بنجاح! 🎉");
        router.push('/login'); // كندوزوه لصفحة تسجيل الدخول
      } else {
        const errorData = await res.json();
        alert("خطأ: " + (errorData.message || "تأكد من المعلومات ديالك"));
      }
    } catch (error) {
      alert("مشكل فالاتصال! تأكد بلي السيرفر ديال الباكاند شاعل.");
    }
  };

  // 4. هنا كاين التصميم ديال الصفحة (HTML/Tailwind)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">أستادي | Oustadi</CardTitle>
          <CardDescription>أنشئ حسابك الجديد للبدء</CardDescription>
        </CardHeader>

        <CardContent>
          {/* الفورم اللي كيعمر فيه المستخدم */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input id="firstName" name="firstName" required onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">النسب</Label>
                <Input id="lastName" name="lastName" required onChange={handleChange} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" required onChange={handleChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" name="password" type="password" required onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              إنشاء حساب
            </Button>
            
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            لديك حساب بالفعل؟ <Link href="/login" className="text-blue-600 hover:underline">تسجيل الدخول</Link>
          </p>
        </CardFooter>

      </Card>
    </div>
  );
}