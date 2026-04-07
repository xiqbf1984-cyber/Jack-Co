'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Typewriter from './typewriter';
import { Briefcase, Bot, ArrowRight } from 'lucide-react';

const ROLES = [
  'AI Research Engineer', 'Full-Stack Developer', 'Product Designer',
  'Data Scientist', 'ML Engineer', 'DevOps Lead',
  'Engineering Manager', 'Backend Architect', 'Growth Marketer',
];

const COMPANY_NAMES = [
  'Google', 'Meta', 'Stripe', 'OpenAI', 'Notion', 'Figma',
  'Vercel', 'Linear', 'Ramp', 'Anthropic', 'Scale AI', 'Databricks',
];

const AGENT_NAMES = [
  'Devin', 'Cursor', 'Bolt', 'Replit', 'v0', 'Windsurf',
  'Claude', 'GPT', 'Gemini', 'Copilot', 'Jasper', 'Perplexity',
];

function LogoMarquee({ items }) {
  return (
    <div style={{
      overflow: 'hidden', width: '100%',
      maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    }}>
      <div style={{
        display: 'flex', gap: 20, whiteSpace: 'nowrap',
        animation: 'marquee-scroll 22s linear infinite',
        width: 'max-content',
      }}>
        {[...items, ...items].map(function (name, i) {
          return (
            <span key={i} style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
              color: 'var(--brown-soft)', flexShrink: 0,
            }}>
              {name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function RoleCarousel() {
  var [idx, setIdx] = useState(0);
  useEffect(function () {
    var timer = setInterval(function () {
      setIdx(function (i) { return (i + 1) % ROLES.length; });
    }, 2000);
    return function () { clearInterval(timer); };
  }, []);

  return (
    <div style={{ height: 32, overflow: 'hidden', position: 'relative' }}>
      {ROLES.map(function (role, i) {
        var isActive = i === idx;
        return (
          <div key={role} style={{
            position: 'absolute', left: 0, right: 0,
            fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 600,
            color: 'var(--gold)',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.4s ease',
          }}>
            {role}
          </div>
        );
      })}
    </div>
  );
}

export default function HeroSection({ tab }) {
  var [alreadyPlayed] = useState(function () {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('hero-typed') === '1';
  });
  var [done, setDone] = useState(alreadyPlayed);
  var handleComplete = useCallback(function () {
    setDone(true);
    try { sessionStorage.setItem('hero-typed', '1'); } catch (e) {}
  }, []);

  var isHuman = tab === 'Hiring Human';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '0 24px',
      width: '100%', maxWidth: 640,
    }}>
      {/* Hero text */}
      <h1 style={{ marginBottom: 24 }}>
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

      {/* Content fades in */}
      <div style={{
        opacity: done ? 1 : 0,
        transition: 'opacity 0.5s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: '100%',
      }}>
        {isHuman ? (
          <>
            {/* Rotating role names */}
            <RoleCarousel />

            {/* CTA card */}
            <div style={{
              width: '100%', marginTop: 32,
              borderRadius: 16, border: '1px solid var(--border-default)',
              backgroundColor: '#fff', boxShadow: 'var(--shadow-card)',
              padding: '24px',
              textAlign: 'left',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)',
                marginBottom: 8,
              }}>
                Describe who you're looking for
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--brown-light)',
                lineHeight: 1.5, minHeight: 54,
                opacity: 0.4,
              }}>
                Senior ML Engineer, 5+ years, strong PyTorch, remote...
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                gap: 10, marginTop: 16,
              }}>
                <Link href="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 24px', borderRadius: 8,
                  border: '1px solid var(--border-default)', background: '#fff',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                  color: 'var(--brown)', textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                  onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                  onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                >
                  Learn More
                </Link>
                <Link href="/signup" className="btn-primary" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 24px', fontSize: 13, textDecoration: 'none',
                }}>
                  Get Started <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Company logos */}
            <div style={{ marginTop: 24, width: '100%' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-light)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
              }}>
                Recruiting for companies like
              </div>
              <LogoMarquee items={COMPANY_NAMES} />
            </div>
          </>
        ) : (
          <>
            {/* Hiring AI - Coming Soon */}
            <div style={{
              width: '100%', marginTop: 24,
              borderRadius: 16, border: '1px solid var(--border-default)',
              backgroundColor: '#fff', boxShadow: 'var(--shadow-card)',
              padding: '48px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 12, opacity: 0.6,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: 'rgba(139,105,20,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={22} style={{ color: 'var(--brown-soft)' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: 'var(--brown)' }}>
                Coming Soon
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--brown-soft)', maxWidth: 300, lineHeight: 1.5 }}>
                Evaluate and benchmark AI agents for your team. Find the ones that actually deliver.
              </div>
            </div>

            {/* Agent logos */}
            <div style={{ marginTop: 24, width: '100%' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-light)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10,
              }}>
                Evaluating agents like
              </div>
              <LogoMarquee items={AGENT_NAMES} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
