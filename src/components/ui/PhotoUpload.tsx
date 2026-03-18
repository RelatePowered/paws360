'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  /** Called when the photo is successfully uploaded. Receives the S3 object key. */
  onUploaded: (key: string) => void;
  /** Tenant ID for the upload path. */
  tenantId: string;
  /** Animal ID for the upload path. */
  animalId: string;
  /** Existing photo key for preview. */
  currentPhotoKey?: string;
  className?: string;
}

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function PhotoUpload({
  onUploaded,
  tenantId,
  animalId,
  currentPhotoKey,
  className,
}: PhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedKey, setUploadedKey] = useState<string | null>(currentPhotoKey ?? null);
  const [storageAvailable, setStorageAvailable] = useState<boolean | null>(null);

  // Check if photo storage is configured on mount
  useEffect(() => {
    fetch('/api/photos/status')
      .then(r => r.json())
      .then(data => setStorageAvailable(data.configured === true))
      .catch(() => setStorageAvailable(false));
  }, []);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please select a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Image must be under 5 MB.');
      return;
    }

    // Local preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    uploadFile(file);
  }

  async function uploadFile(file: File) {
    // Fast-fail if storage isn't configured (or still unknown)
    if (storageAvailable !== true) {
      setError('Photo storage is not available. Please try again later.');
      setPreview(null);
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', tenantId);
    formData.append('animalId', animalId);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }
      const { key } = await res.json();
      setUploadedKey(key);
      onUploaded(key);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Upload timed out. Please check your connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Upload failed');
      }
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  function clearPhoto() {
    setPreview(null);
    setUploadedKey(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  const hasPhoto = preview || uploadedKey;

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={fileRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />

      {hasPhoto ? (
        <div className="relative inline-block">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-xl object-cover border border-border"
            />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-success/10 flex items-center justify-center border border-success/30">
              <ImageIcon className="w-8 h-8 text-success" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
          {!uploading && (
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute -top-2 -right-2 w-6 h-6 bg-danger rounded-full flex items-center justify-center text-white shadow"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : storageAvailable !== true ? (
        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted opacity-50">
          <Upload className="w-6 h-6" />
          <span className="text-xs font-medium text-center px-1">
            {storageAvailable === null ? 'Checking…' : 'Storage not configured'}
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-32 h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted hover:text-primary transition-colors"
        >
          <Upload className="w-6 h-6" />
          <span className="text-xs font-medium">Upload Photo</span>
        </button>
      )}

      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
      <p className="text-xs text-muted">JPG, PNG, or WebP. Max 5 MB.</p>
    </div>
  );
}
