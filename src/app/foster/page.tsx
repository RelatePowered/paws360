'use client';

import { useState } from 'react';
import {
  Home,
  Plus,
  Search,
  User,
  PawPrint,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField';
import { DataTable } from '@/components/ui/DataTable';
import { useFosterHomes, useFosterPlacements, useAnimals, mockFosterHomes, mockFosterPlacements, mockAnimals } from '@/hooks/useTenantData';
import { formatDate } from '@/lib/utils';
import type { FosterHome, FosterPlacement } from '@/lib/types';

function getPlacementStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'foster-to-adopt': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

export default function FosterPage() {
  const fosterHomes = useFosterHomes(mockFosterHomes);
  const placements = useFosterPlacements(mockFosterPlacements);
  const animals = useAnimals(mockAnimals);
  const [tab, setTab] = useState<'homes' | 'placements'>('homes');
  const [selectedHome, setSelectedHome] = useState<FosterHome | null>(null);
  const [showAddHome, setShowAddHome] = useState(false);

  const activeHomes = fosterHomes.filter(h => h.isActive);
  const activePlacements = placements.filter(p => p.status === 'active');
  const totalCapacity = activeHomes.reduce((s, h) => s + h.capacity, 0);
  const totalOccupied = activeHomes.reduce((s, h) => s + h.currentCount, 0);

  const homeColumns = [
    {
      key: 'name',
      header: 'Foster Parent',
      render: (h: FosterHome) => (
        <div>
          <p className="font-medium">{h.firstName} {h.lastName}</p>
          <p className="text-xs text-muted">{h.email}</p>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (h: FosterHome) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{h.currentCount}/{h.capacity}</span>
          {h.currentCount >= h.capacity && <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Full</Badge>}
          {h.currentCount === 0 && <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Available</Badge>}
        </div>
      ),
    },
    {
      key: 'preferences',
      header: 'Preferences',
      hideOnMobile: true,
      render: (h: FosterHome) => (
        <div className="flex flex-wrap gap-1">
          {h.speciesPreference.map(s => (
            <Badge key={s} className="bg-primary/10 text-primary capitalize">{s}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      hideOnMobile: true,
      render: (h: FosterHome) => <span className="text-sm">{h.phone}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (h: FosterHome) => (
        <Badge className={h.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}>
          {h.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const placementColumns = [
    {
      key: 'animal',
      header: 'Animal',
      render: (p: FosterPlacement) => (
        <div>
          <p className="font-medium">{p.animalName}</p>
          <p className="text-xs text-muted">{p.animalId}</p>
        </div>
      ),
    },
    {
      key: 'foster',
      header: 'Foster Home',
      render: (p: FosterPlacement) => <span className="text-sm">{p.fosterName}</span>,
    },
    {
      key: 'dates',
      header: 'Dates',
      hideOnMobile: true,
      render: (p: FosterPlacement) => (
        <div className="text-sm">
          <p>{formatDate(p.startDate)}</p>
          {p.endDate && <p className="text-xs text-muted">to {formatDate(p.endDate)}</p>}
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      hideOnMobile: true,
      render: (p: FosterPlacement) => {
        const start = new Date(p.startDate);
        const end = p.endDate ? new Date(p.endDate) : new Date();
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return <span className="text-sm">{days} days</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: FosterPlacement) => (
        <Badge className={getPlacementStatusColor(p.status)}>
          {p.status.replace(/-/g, ' ')}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Foster Management</h1>
          <p className="text-muted text-sm mt-1">Manage foster homes and animal placements</p>
        </div>
        <Button onClick={() => setShowAddHome(true)}>
          <Plus className="w-4 h-4" />
          Add Foster Home
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-surface border border-border text-center">
          <p className="text-2xl font-bold text-primary">{activeHomes.length}</p>
          <p className="text-sm text-muted">Active Homes</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activePlacements.length}</p>
          <p className="text-sm text-muted">Active Placements</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border text-center">
          <p className="text-2xl font-bold">{totalOccupied}/{totalCapacity}</p>
          <p className="text-sm text-muted">Capacity Used</p>
        </div>
        <div className="p-4 rounded-lg bg-surface border border-border text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {placements.filter(p => p.status === 'foster-to-adopt').length}
          </p>
          <p className="text-sm text-muted">Foster-to-Adopt</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setTab('homes')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'homes' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <Home className="w-4 h-4 inline mr-1" />
          Foster Homes ({activeHomes.length})
        </button>
        <button
          onClick={() => setTab('placements')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'placements' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <PawPrint className="w-4 h-4 inline mr-1" />
          Placements ({placements.length})
        </button>
      </div>

      {/* Foster Homes Table */}
      {tab === 'homes' && (
        <Card>
          <DataTable
            columns={homeColumns}
            data={fosterHomes}
            keyExtractor={(h) => h.id}
            onRowClick={(h) => setSelectedHome(h)}
          />
        </Card>
      )}

      {/* Placements Table */}
      {tab === 'placements' && (
        <Card>
          <DataTable
            columns={placementColumns}
            data={placements}
            keyExtractor={(p) => p.id}
          />
        </Card>
      )}

      {/* Foster Home Detail Modal */}
      <Modal open={!!selectedHome} onClose={() => setSelectedHome(null)} title={selectedHome ? `${selectedHome.firstName} ${selectedHome.lastName}` : ''} size="lg">
        {selectedHome && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted" /> {selectedHome.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted" /> {selectedHome.phone}
              </div>
              {selectedHome.address && (
                <div className="flex items-center gap-2 text-sm sm:col-span-2">
                  <MapPin className="w-4 h-4 text-muted" />
                  {[selectedHome.address, selectedHome.city, selectedHome.state, selectedHome.zip].filter(Boolean).join(', ')}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-surface-hover text-center">
                <p className="text-xs text-muted">Capacity</p>
                <p className="text-lg font-bold">{selectedHome.currentCount}/{selectedHome.capacity}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-hover text-center">
                <p className="text-xs text-muted">Status</p>
                <p className="text-lg font-bold">{selectedHome.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {selectedHome.speciesPreference.map(s => (
                  <Badge key={s} className="bg-primary/10 text-primary capitalize">{s}</Badge>
                ))}
                {selectedHome.sizePreference.map(s => (
                  <Badge key={s} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">{s}</Badge>
                ))}
              </div>
            </div>

            {selectedHome.notes && (
              <div>
                <h4 className="text-sm font-medium mb-1">Notes</h4>
                <p className="text-sm text-muted">{selectedHome.notes}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium mb-2">Current Placements</h4>
              {placements.filter(p => p.fosterHomeId === selectedHome.id && p.status === 'active').length === 0 ? (
                <p className="text-sm text-muted text-center py-4">No current placements</p>
              ) : (
                <div className="space-y-2">
                  {placements.filter(p => p.fosterHomeId === selectedHome.id && p.status === 'active').map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-sm">{p.animalName}</p>
                        <p className="text-xs text-muted">Since {formatDate(p.startDate)}</p>
                      </div>
                      <Badge className={getPlacementStatusColor(p.status)}>{p.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Foster Home Modal */}
      <Modal open={showAddHome} onClose={() => setShowAddHome(false)} title="Add Foster Home" size="lg">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddHome(false); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <Input placeholder="First name" required />
            </FormField>
            <FormField label="Last Name" required>
              <Input placeholder="Last name" required />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" placeholder="Email address" required />
            </FormField>
            <FormField label="Phone" required>
              <Input placeholder="Phone number" required />
            </FormField>
            <FormField label="Address">
              <Input placeholder="Street address" />
            </FormField>
            <FormField label="City">
              <Input placeholder="City" />
            </FormField>
            <FormField label="State">
              <Input placeholder="State" />
            </FormField>
            <FormField label="Zip">
              <Input placeholder="Zip code" />
            </FormField>
            <FormField label="Capacity" required>
              <Input type="number" min={1} placeholder="Max animals" required />
            </FormField>
          </div>
          <FormField label="Notes">
            <Textarea placeholder="Home details, yard, experience, etc." rows={3} />
          </FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddHome(false)}>Cancel</Button>
            <Button type="submit">Add Foster Home</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
