import React from 'react';
import { cn } from "../../lib/utils"
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

// Define spinner styles
const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
});

// Define loader styles
const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function Spinner({ size = 'medium', show = true, children, className }) {
  const spinnerClasses = spinnerVariants({ show });
  const loaderClasses = cn(loaderVariants({ size }), className);

  return (
    <span className={spinnerClasses}>
      <Loader2 className={loaderClasses} />
      {children}
    </span>
  );
}
