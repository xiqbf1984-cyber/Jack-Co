import Topbar from '@/components/layout/topbar';
import HeroSection from '@/components/landing/hero-section';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-1 flex items-center justify-center">
        <HeroSection />
      </main>
    </div>
  );
}
