'use client';

import { useState } from 'react';
import { UpgradeGate } from '@/components/ui/UpgradeGate';
import {
  MapPin,
  PawPrint,
  Search,
  Printer,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { useKennelLocations, useAnimals } from '@/hooks/useTenantData';
import { getStatusBadgeColor } from '@/lib/utils';
import type { KennelLocation } from '@/lib/types';

export default function KennelsPage() {
  const kennels = useKennelLocations();
  const animals = useAnimals();
  const [zoneFilter, setZoneFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');

  const zones = Array.from(new Set(kennels.map(k => k.zone)));
  const totalKennels = kennels.length;
  const occupiedKennels = kennels.filter(k => k.isOccupied).length;
  const availableKennels = totalKennels - occupiedKennels;
  const occupancyRate = totalKennels > 0 ? Math.round((occupiedKennels / totalKennels) * 100) : 0;

  const filtered = kennels.filter(k => {
    const matchesZone = zoneFilter === 'all' || k.zone === zoneFilter;
    const matchesSpecies = speciesFilter === 'all' || k.species === speciesFilter;
    return matchesZone && matchesSpecies;
  });

  const groupedByZone = filtered.reduce((acc, k) => {
    if (!acc[k.zone]) acc[k.zone] = [];
    acc[k.zone].push(k);
    return acc;
  }, {} as Record<string, KennelLocation[]>);

  return (
    <UpgradeGate feature="kennel_map">
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kennel Map</h1>
          <p className="text-muted text-sm mt-1">Visual overview of facility occupancy</p>
        </div>
      </div>

      {/* Capacity Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-surface border border-border text-center">
          <p className="text-2xl font-bold">{totalKennels}</p>
          <p className="text-sm text-muted">Total Kennels</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{occupiedKennels}</p>
          <p className="text-sm text-muted">Occupied</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{availableKennels}</p>
          <p className="text-sm text-muted">Available</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border text-center">
          <p className="text-2xl font-bold">{occupancyRate}%</p>
          <p className="text-sm text-muted">Occupancy Rate</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="w-48">
              <option value="all">All Zones</option>
              {zones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </Select>
            <Select value={speciesFilter} onChange={e => setSpeciesFilter(e.target.value)} className="w-36">
              <option value="all">All Species</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
              <option value="bird">Birds</option>
              <option value="rabbit">Rabbits</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Kennel Grid by Zone */}
      {Object.entries(groupedByZone).map(([zone, zoneKennels]) => (
        <Card key={zone}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {zone}
              </h3>
              <span className="text-sm text-muted">
                {zoneKennels.filter(k => k.isOccupied).length}/{zoneKennels.length} occupied
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {zoneKennels.map(kennel => {
                const animal = kennel.currentAnimalId
                  ? animals.find(a => a.id === kennel.currentAnimalId)
                  : null;

                return (
                  <div
                    key={kennel.id}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      kennel.isOccupied
                        ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                        : 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-sm">{kennel.name}</span>
                      <span className="capitalize text-xs text-muted">{kennel.size}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <PawPrint className="w-3 h-3 text-muted" />
                      <span className="text-xs capitalize text-muted">{kennel.species}</span>
                    </div>
                    {kennel.isOccupied && kennel.currentAnimalName ? (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-sm font-medium">{kennel.currentAnimalName}</p>
                        {animal && (
                          <div className="flex items-center gap-1 mt-1">
                            <Badge className={getStatusBadgeColor(animal.status)} >
                              {animal.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-green-700 dark:text-green-400 mt-2 font-medium">Empty</p>
                    )}
                    {kennel.notes && (
                      <p className="text-xs text-muted mt-1 italic">{kennel.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
    </UpgradeGate>
  );
}
