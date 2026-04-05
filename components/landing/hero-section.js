'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Typewriter from './typewriter';
import HireTypeCards from './hire-type-cards';

export default function HeroSection() {
  const [phase, setPhase] = useState('typing'); // typing | subtitle | cards

  const handleTypewriterComplete = useCallback(() => {
    setPhase('subtitle');
    // After subtitle animation, show cards
    setTimeout(() => setPhase('cards'), 600);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h1>
        <Typewriter
          text="Who do you want to hire?"
          delay={60}
          onComplete={handleTypewriterComplete}
        />
      </h1>

      <p
        className={cn(
          'text-body-lg max-w-md',
          phase === 'typing' ? 'opacity-0' : 'animate-fsu'
        )}
        style={{ color: 'var(--brown-muted)' }}
      >
        In the age of AI, the only thing that matters is what you can do.
      </p>

      <div
        className={cn(
          'mt-4',
          phase !== 'cards' ? 'opacity-0' : 'animate-fsu'
        )}
        style={phase === 'cards' ? { animationDelay: '0.1s', animationFillMode: 'backwards' } : undefined}
      >
        <HireTypeCards />
      </div>
    </div>
  );
}
