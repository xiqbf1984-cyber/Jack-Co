'use client';

import { useState, useCallback } from 'react';
import Typewriter from './typewriter';
import HireTypeCards from './hire-type-cards';

export default function HeroSection({ tab }) {
  const [done, setDone] = useState(false);
  const handleComplete = useCallback(() => setDone(true), []);

  const isCompanies = tab === 'For Companies';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>
      <h1>
        <Typewriter
          text="Who do you want to hire?"
          delay={55}
          onComplete={handleComplete}
        />
      </h1>

      <div style={{ minHeight: 32, marginTop: 16 }}>
        {done && (
          <p
            className="animate-fsu text-body-lg"
            style={{ color: 'var(--brown-muted)', maxWidth: 440 }}
          >
            See How Candidates Actually Work with AI.
          </p>
        )}
      </div>

      <div style={{ minHeight: 170, marginTop: 48 }}>
        {done && isCompanies && (
          <div className="animate-fsu">
            <HireTypeCards />
          </div>
        )}

        {done && !isCompanies && (
          <p
            className="animate-fsu text-body-sm"
            style={{ color: 'var(--brown-light)' }}
          >
            Candidate features coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
