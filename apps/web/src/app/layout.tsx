import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// هنا بدلنا السمية والوصف ديال الموقع
export const metadata: Metadata = {
  title: "أستادي | Oustadi",
  description: "منصة للبحث عن الأساتذة لتقديم دروس الدعم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // هادي باش نتجاهلو تحذيرات الإضافات (Extensions)
    >
      <body 
        className="min-h-full flex flex-col"
        suppressHydrationWarning // وحتى هادي ضرورية
      >
        {children}
      </body>
    </html>
  );
}