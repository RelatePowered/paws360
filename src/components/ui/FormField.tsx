'use client';

import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
        'placeholder:text-muted',
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
        'placeholder:text-muted resize-none',
        className
      )}
      {...props}
    />
  );
}
