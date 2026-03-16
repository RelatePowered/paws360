'use client';

import { UpgradeGate } from '@/components/ui/UpgradeGate';

import { useState } from 'react';
import { Share2, RefreshCw, Copy, Check, Facebook, Twitter, Instagram } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import AnimalPhoto from '@/components/ui/AnimalPhoto';
import { useAnimals } from '@/hooks/useTenantData';
import { useAuth } from '@/context/AuthContext';
import { generatePost, generateAllPlatforms, type SocialPlatform } from '@/lib/social-templates';
import type { Animal } from '@/lib/types';
import { cn } from '@/lib/utils';

const platformConfig: Record<SocialPlatform, { label: string; icon: typeof Facebook; color: string; charLimit?: number }> = {
  facebook: { label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  instagram: { label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  x: { label: 'X (Twitter)', icon: Twitter, color: 'text-foreground', charLimit: 280 },
};

export default function SocialMediaPage() {
  const animals = useAnimals();
  const { currentTenant } = useAuth();
  const availableAnimals = animals.filter(a => a.status === 'available');

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [posts, setPosts] = useState<Record<SocialPlatform, string> | null>(null);
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>('facebook');
  const [copiedPlatform, setCopiedPlatform] = useState<SocialPlatform | null>(null);

  const shelterName = currentTenant?.name ?? 'Our Shelter';

  function handleSelectAnimal(animal: Animal) {
    setSelectedAnimal(animal);
    setPosts(generateAllPlatforms(animal, shelterName));
    setCopiedPlatform(null);
  }

  function handleRegenerate() {
    if (!selectedAnimal) return;
    setPosts(generateAllPlatforms(selectedAnimal, shelterName));
    setCopiedPlatform(null);
  }

  function handleRegeneratePlatform(platform: SocialPlatform) {
    if (!selectedAnimal || !posts) return;
    setPosts({ ...posts, [platform]: generatePost(selectedAnimal, shelterName, platform) });
    setCopiedPlatform(null);
  }

  async function handleCopy(platform: SocialPlatform) {
    if (!posts) return;
    await navigator.clipboard.writeText(posts[platform]);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  }

  return (
    <UpgradeGate feature="social_media_ai">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Share2 className="w-6 h-6" /> Social Media Posts
        </h1>
        <p className="text-muted text-sm mt-1">
          Generate adoption posts for your available animals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animal Picker */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="font-semibold">Available Animals ({availableAnimals.length})</h2>
          </CardHeader>
          <CardBody className="max-h-[600px] overflow-y-auto">
            {availableAnimals.length === 0 ? (
              <p className="text-muted text-sm text-center py-8">No animals currently available for adoption.</p>
            ) : (
              <div className="space-y-2">
                {availableAnimals.map(animal => (
                  <button
                    key={animal.id}
                    onClick={() => handleSelectAnimal(animal)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                      selectedAnimal?.id === animal.id
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-surface-hover border border-transparent'
                    )}
                  >
                    <AnimalPhoto photoKey={animal.photoUrl} alt={animal.name} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{animal.name}</p>
                      <p className="text-xs text-muted truncate">{animal.breed} &middot; {animal.age ?? 'Unknown age'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Post Generator */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedAnimal ? (
            <Card>
              <CardBody>
                <div className="text-center py-16 text-muted">
                  <Share2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Select an animal to get started</p>
                  <p className="text-sm mt-1">Choose from the available animals on the left to generate adoption posts.</p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <>
              {/* Animal Summary */}
              <Card>
                <CardBody>
                  <div className="flex items-center gap-4">
                    <AnimalPhoto photoKey={selectedAnimal.photoUrl} alt={selectedAnimal.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold">{selectedAnimal.name}</h2>
                      <p className="text-muted text-sm">{selectedAnimal.breed} &middot; {selectedAnimal.age} &middot; {selectedAnimal.gender} &middot; {selectedAnimal.size}</p>
                      <p className="text-sm mt-2 line-clamp-2">{selectedAnimal.description}</p>
                      {selectedAnimal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedAnimal.tags.map(tag => (
                            <Badge key={tag} className="bg-primary/10 text-primary text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRegenerate} title="Regenerate all posts">
                      <RefreshCw className="w-4 h-4" /> Regenerate All
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {/* Platform Tabs */}
              <div className="flex gap-1 border-b border-border">
                {(Object.keys(platformConfig) as SocialPlatform[]).map(platform => {
                  const cfg = platformConfig[platform];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={platform}
                      onClick={() => setActivePlatform(platform)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                        activePlatform === platform
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', activePlatform === platform && cfg.color)} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Post Content */}
              {posts && (
                <Card>
                  <CardBody>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{platformConfig[activePlatform].label} Post</h3>
                        {platformConfig[activePlatform].charLimit && (
                          <Badge className={
                            posts[activePlatform].length > platformConfig[activePlatform].charLimit!
                              ? 'bg-danger/10 text-danger'
                              : 'bg-muted/10 text-muted'
                          }>
                            {posts[activePlatform].length} / {platformConfig[activePlatform].charLimit}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegeneratePlatform(activePlatform)}
                          title="Regenerate this post"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant={copiedPlatform === activePlatform ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleCopy(activePlatform)}
                        >
                          {copiedPlatform === activePlatform ? (
                            <><Check className="w-3.5 h-3.5" /> Copied!</>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" /> Copy</>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-background rounded-lg border border-border p-4">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {posts[activePlatform]}
                      </pre>
                    </div>
                    {activePlatform === 'instagram' && selectedAnimal.photoUrl && (
                      <p className="text-xs text-muted mt-3">
                        Tip: Download the animal&apos;s photo from their profile to attach to your Instagram post.
                      </p>
                    )}
                  </CardBody>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </UpgradeGate>
  );
}
