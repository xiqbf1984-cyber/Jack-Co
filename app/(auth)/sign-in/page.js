import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream)' }}>
      <SignIn afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />
    </div>
  );
}
