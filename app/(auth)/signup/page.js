import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-[400px] rounded-2xl border p-8 text-center"
        style={{
          backgroundColor: 'var(--cream-card)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h1 className="font-display text-[24px] mb-2" style={{ color: 'var(--brown)' }}>
          Sign up
        </h1>
        <p className="text-body-xs mb-6">Create your WorkTrial account.</p>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-3 py-2.5 rounded-lg border text-body-sm outline-none font-body"
            style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2.5 rounded-lg border text-body-sm outline-none font-body"
            style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2.5 rounded-lg border text-body-sm outline-none font-body"
            style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border-default)', color: 'var(--brown)' }}
          />
        </div>

        <Link href="/dashboard" className="btn-primary w-full no-underline block text-center">
          Create Account
        </Link>

        <p className="text-body-xs mt-4">
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--gold)' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
