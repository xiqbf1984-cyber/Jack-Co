'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Users, Bot } from 'lucide-react';

const COMPANY_LOGOS = [
  'Google', 'Meta', 'Stripe', 'OpenAI', 'Notion', 'Figma',
  'Vercel', 'Linear', 'Ramp', 'Anthropic', 'Scale AI', 'Databricks',
];

const AGENT_LOGOS = [
  'Devin', 'Cursor', 'Bolt', 'Replit', 'v0', 'Windsurf',
  'Claude', 'GPT', 'Gemini', 'Copilot', 'Jasper', 'Perplexity',
];

function LogoMarquee({ items, direction }) {
  var dur = direction === 'right' ? '25s' : '20s';
  var animDir = direction === 'right' ? 'normal' : 'reverse';
  return (
    <div style={{
      overflow: 'hidden', width: '100%',
      maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
    }}>
      <div style={{
        display: 'flex', gap: 24, whiteSpace: 'nowrap',
        animation: 'marquee-scroll ' + dur + ' linear infinite ' + animDir,
        width: 'max-content',
      }}>
        {[...items, ...items].map(function (name, i) {
          return (
            <span key={i} style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
              color: 'var(--brown-light)', letterSpacing: '0.02em',
              padding: '4px 12px', borderRadius: 6,
              backgroundColor: 'rgba(139,105,20,0.04)',
              border: '1px solid rgba(139,105,20,0.06)',
              flexShrink: 0,
            }}>
              {name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function HireTypeCards() {
  var isSignedIn = useAuth().isSignedIn;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* Hiring Human */}
      <Link href={isSignedIn ? '/dashboard' : '/login'} style={{ textDecoration: 'none' }}>
        <div
          style={{
            padding: '28px 24px',
            borderRadius: 16,
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--cream-card)',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex', flexDirection: 'column', gap: 16,
            minHeight: 200,
          }}
          onMouseEnter={function (e) {
            e.currentTarget.style.borderColor = 'var(--gold)';
            e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={function (e) {
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.boxShadow = 'var(--shadow-card)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--btn-primary-from), var(--btn-primary-to))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Users size={17} style={{ color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 600, color: 'var(--brown)' }}>
                Hiring Human
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
                Evaluate candidates with work samples
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-light)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
            }}>
              Recruiting for companies like
            </div>
            <LogoMarquee items={COMPANY_LOGOS} direction="right" />
          </div>
        </div>
      </Link>

      {/* Hiring AI */}
      <div
        style={{
          padding: '28px 24px',
          borderRadius: 16,
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--cream-card)',
          boxShadow: 'var(--shadow-card)',
          cursor: 'default',
          position: 'relative',
          display: 'flex', flexDirection: 'column', gap: 16,
          minHeight: 200,
          opacity: 0.55,
        }}
      >
        <span style={{
          position: 'absolute', top: 12, right: 14,
          fontSize: 10, fontFamily: 'var(--font-body)',
          color: 'var(--brown-soft)', backgroundColor: 'var(--cream-sidebar)',
          padding: '2px 8px', borderRadius: 9999,
        }}>
          Coming soon
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            backgroundColor: 'rgba(139,105,20,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Bot size={17} style={{ color: 'var(--brown-soft)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 600, color: 'var(--brown)' }}>
              Hiring AI
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--brown-soft)' }}>
              Find the best AI agent for your team
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--brown-light)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
          }}>
            Evaluating agents like
          </div>
          <LogoMarquee items={AGENT_LOGOS} direction="left" />
        </div>
      </div>
    </div>
  );
}
