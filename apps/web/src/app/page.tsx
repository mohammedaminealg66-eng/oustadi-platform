import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header بسيط */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b justify-between">
        <span className="text-2xl font-bold text-blue-600">أستادي | Oustadi</span>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">تسجيل الدخول</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">ابدأ الآن</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-gray-900">
              مرحباً بكم في منصة <span className="text-blue-600">أستادي</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl mt-4">
              المنصة رقم 1 في المغرب لربط الأساتذة المتميزين بالتلاميذ الطموحين. تعلم بذكاء، انجح بثقة.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  أنا تلميذ، أريد التعلم
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="px-8 border-blue-600 text-blue-600 hover:bg-blue-50">
                  أنا أستاذ، أريد التدريس
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t text-center text-gray-500 text-sm">
        © 2026 Oustadi Platform. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}