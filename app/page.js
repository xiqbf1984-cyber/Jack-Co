'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/topbar';
import HeroSection from '@/components/landing/hero-section';

export default function LandingPage() {
  const [tab, setTab] = useState('For Candidates');

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar tab={tab} onTabChange={setTab} />
      <main className="flex-1 flex items-center justify-center">
        <HeroSection tab={tab} />
      </main>
    </div>
  );
}
