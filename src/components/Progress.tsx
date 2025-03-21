import * as React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have this utility function

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = (Math.min(Math.max(value, 0), max) / max) * 100;

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
          className
        )}
        {...props}
      >
        <div
          className='h-full w-full flex-1 bg-orange-500 transition-all'
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
