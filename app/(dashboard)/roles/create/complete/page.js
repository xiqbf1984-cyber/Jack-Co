'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import RoleComplete from '@/components/role-creation/role-complete';

function CompleteContent() {
  var searchParams = useSearchParams();
  var title = searchParams.get('title') || 'New Role';

  return <RoleComplete roleTitle={title} />;
}

export default function RoleCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <p className="text-body-sm" style={{ color: 'var(--brown-muted)' }}>Loading...</p>
        </div>
      }
    >
      <CompleteContent />
    </Suspense>
  );
}
