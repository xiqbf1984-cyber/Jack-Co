'use client';

import { useState, useCallback } from 'react';
import Typewriter from './typewriter';
import HireTypeCards from './hire-type-cards';

export default function HeroSection({ tab }) {
  const [alreadyPlayed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('hero-typed') === '1';
  });
  const [done, setDone] = useState(alreadyPlayed);
  const handleComplete = useCallback(() => {
    setDone(true);
    try { sessionStorage.setItem('hero-typed', '1'); } catch (e) {}
  }, []);

  const isCompanies = tab === 'For Companies';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '0 24px',
      paddingTop: 60,
    }}>
      <h1 style={{ marginBottom: 0 }}>
        {alreadyPlayed ? (
          <span className="text-display-hero">Who do you want to hire?</span>
        ) : (
          <Typewriter
            text="Who do you want to hire?"
            delay={55}
            onComplete={handleComplete}
          />
        )}
      </h1>

      <div style={{
        opacity: done ? 1 : 0,
        transition: 'opacity 0.5s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}>
        {isCompanies && (
          <div style={{ marginTop: 48, width: '100%', maxWidth: 680 }}>
            <HireTypeCards />
          </div>
        )}

        {!isCompanies && (
          <p
            className="text-body-sm"
            style={{ color: 'var(--brown-light)', marginTop: 48 }}
          >
            Candidate features coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
