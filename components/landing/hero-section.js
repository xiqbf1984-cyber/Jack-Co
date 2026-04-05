'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Typewriter from './typewriter';
import HireTypeCards from './hire-type-cards';

export default function HeroSection({ tab }) {
  const [phase, setPhase] = useState('typing'); // typing | done

  const handleTypewriterComplete = useCallback(() => {
    setPhase('done');
  }, []);

  const showCards = tab === 'For Companies' && phase === 'done';

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

      {showCards && (
        <div className="mt-4 animate-fsu">
          <HireTypeCards />
        </div>
      )}
    </div>
  );
}
