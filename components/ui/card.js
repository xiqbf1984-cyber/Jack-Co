'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Card = forwardRef(function Card(
  { children, className, glass = false, onClick, hoverable = false, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'bg-[var(--cream-card)] border border-[var(--border-default)]',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]',
        'transition-all duration-200',
        hoverable && 'hover:shadow-[var(--shadow-card-hover)] cursor-pointer',
        glass && 'liquid-glass',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef(function CardHeader({ children, className, ...props }, ref) {
  return (
    <div ref={ref} className={cn('px-5 pt-5 pb-3', className)} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

const CardBody = forwardRef(function CardBody({ children, className, ...props }, ref) {
  return (
    <div ref={ref} className={cn('px-5 pb-5', className)} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

export { Card, CardHeader, CardBody };
