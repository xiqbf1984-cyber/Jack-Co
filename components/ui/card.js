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
        'surface-card',
        hoverable && 'surface-card-interactive',
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
    <div ref={ref} className={cn('px-6 pt-6 pb-3', className)} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

const CardBody = forwardRef(function CardBody({ children, className, ...props }, ref) {
  return (
    <div ref={ref} className={cn('px-6 pb-6', className)} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

export { Card, CardHeader, CardBody };
