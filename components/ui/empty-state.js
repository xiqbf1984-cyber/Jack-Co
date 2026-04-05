'use client';

import { cn } from '@/lib/utils';
import { Button } from './button';

function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      {Icon && (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--cream)] border border-[var(--border-default)] mb-4">
          <Icon size={22} className="text-[var(--brown-soft)]" />
        </div>
      )}
      {title && (
        <h3 className="text-display-section mb-1.5">{title}</h3>
      )}
      {description && (
        <p className="text-body-sm text-[var(--brown-soft)] max-w-xs mb-5">
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
