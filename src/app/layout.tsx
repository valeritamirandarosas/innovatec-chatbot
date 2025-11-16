
'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-context';
import { Header } from '@/components/header';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Since the root layout is now a client component, metadata is handled differently.
// This is a common pattern for client-side root layouts.
// We are keeping the metadata object here for reference, but it won't be applied directly.
// For full SEO, metadata would need to be managed in child server components or pages.
/*
export const metadata: Metadata = {
  title: 'TeacherBot',
  description: 'Estudiar es como maratonear tu serie favorita.',
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>TeacherBot</title>
        <meta name="description" content="Estudiar es como maratonear tu serie favorita." />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
