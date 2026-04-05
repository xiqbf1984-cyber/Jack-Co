'use client';

import { cn } from '@/lib/utils';
import { Button } from './button';

function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      {Icon && (
        <div
          className="w-12 h-12 flex items-center justify-center rounded-full mb-4"
          style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--border-default)' }}
        >
          <Icon size={22} style={{ color: 'var(--brown-soft)' }} />
        </div>
      )}
      {title && (
        <h3 className="text-display-section mb-1.5">{title}</h3>
      )}
      {description && (
        <p className="text-body-sm max-w-xs mb-5" style={{ color: 'var(--brown-soft)' }}>
          {description}
        </p>
      )}
      {action && (
        <Button {...action} />
      )}
    </div>
  );
}

export { EmptyState };
