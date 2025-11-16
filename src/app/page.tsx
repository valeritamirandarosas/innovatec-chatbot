
'use client';

import { About } from '@/components/landing/about';
import { Feedback } from '@/components/landing/feedback';
import { Hero } from '@/components/landing/hero';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-16 md:space-y-24">
        <Hero />
        <Separator />
        <About />
        <Separator />
        <Feedback />
      </div>
    </div>
  );
}
