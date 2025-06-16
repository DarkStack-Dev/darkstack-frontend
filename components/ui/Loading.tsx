'use client';

import { cn } from '@/app/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const Loading = ({ size = 'md', className, text }: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'border-2 border-border-default border-t-primary-500 rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-text-secondary text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;