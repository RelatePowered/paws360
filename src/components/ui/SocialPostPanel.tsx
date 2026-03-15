'use client';

import { useState } from 'react';
import { Share2, RefreshCw, Copy, Check, Facebook, Twitter, Instagram, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { generatePost, generateAllPlatforms, type SocialPlatform } from '@/lib/social-templates';
import type { Animal } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SocialPostPanelProps {
  animal: Animal;
  shelterName: string;
}

const platforms: { key: SocialPlatform; label: string; icon: typeof Facebook; color: string; charLimit?: number }[] = [
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { key: 'x', label: 'X', icon: Twitter, color: 'text-foreground', charLimit: 280 },
];

export default function SocialPostPanel({ animal, shelterName }: SocialPostPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [posts, setPosts] = useState<Record<SocialPlatform, string> | null>(null);
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>('facebook');
  const [copied, setCopied] = useState(false);

  function handleExpand() {
    if (!expanded) {
      setPosts(generateAllPlatforms(animal, shelterName));
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }

  function handleRegenerate() {
    setPosts(generateAllPlatforms(animal, shelterName));
    setCopied(false);
  }

  function handleRegeneratePlatform() {
    if (!posts) return;
    setPosts({ ...posts, [activePlatform]: generatePost(animal, shelterName, activePlatform) });
    setCopied(false);
  }

  async function handleCopy() {
    if (!posts) return;
    await navigator.clipboard.writeText(posts[activePlatform]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (animal.status !== 'available') {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={handleExpand}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Share2 className="w-4 h-4 text-primary" />
          Generate Social Media Post
        </span>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
      </button>

      {expanded && posts && (
        <div className="border-t border-border px-4 py-3 space-y-3">
          {/* Platform tabs */}
          <div className="flex items-center gap-1">
            {platforms.map(p => {
              const Icon = p.icon;
              return (
                <button
                  key={p.key}
                  onClick={() => { setActivePlatform(p.key); setCopied(false); }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    activePlatform === p.key
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted hover:text-foreground hover:bg-surface-hover'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5', activePlatform === p.key && p.color)} />
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Post content */}
          <div className="bg-background rounded-lg border border-border p-3">
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed max-h-48 overflow-y-auto">
              {posts[activePlatform]}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {platforms.find(p => p.key === activePlatform)?.charLimit && (
                <Badge className={
                  posts[activePlatform].length > (platforms.find(p => p.key === activePlatform)!.charLimit!)
                    ? 'bg-danger/10 text-danger text-xs'
                    : 'bg-muted/10 text-muted text-xs'
                }>
                  {posts[activePlatform].length} / {platforms.find(p => p.key === activePlatform)!.charLimit}
                </Badge>
              )}
            </div>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="sm" onClick={handleRegeneratePlatform} title="New variation">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRegenerate} title="Regenerate all platforms">
                <RefreshCw className="w-3.5 h-3.5" /> All
              </Button>
              <Button
                variant={copied ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleCopy}
              >
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
