'use client';

import { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimalPhotoProps {
  /** S3 key stored in the animal's photoUrl field. */
  photoKey?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-9 h-9 rounded-lg',
  md: 'w-16 h-16 rounded-xl',
  lg: 'w-32 h-32 rounded-2xl',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

/**
 * Displays an animal photo from S3 via signed URL, or a paw-print
 * placeholder when no photo is available.
 */
export default function AnimalPhoto({ photoKey, alt, size = 'md', className }: AnimalPhotoProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!photoKey) return;
    setError(false);
    setUrl(null);

    fetch(`/api/photos/url?key=${encodeURIComponent(photoKey)}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setUrl(data.url))
      .catch(() => setError(true));
  }, [photoKey]);

  // Placeholder
  if (!photoKey || error || !url) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          'bg-primary/10 flex items-center justify-center text-primary shrink-0',
          className
        )}
      >
        <PawPrint className={iconSizes[size]} />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={cn(sizeClasses[size], 'object-cover shrink-0', className)}
      onError={() => setError(true)}
    />
  );
}
