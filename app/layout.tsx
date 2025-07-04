import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { supabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lessay Cline",
  description:
    "Lessay Cline is a software development company specializing in building innovative solutions with a focus on clean code and efficient development practices.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = supabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Basic check for new users - note: missing pathname check
  if (user?.user_metadata?.status === 'new') {
    redirect('/onboarding');
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
