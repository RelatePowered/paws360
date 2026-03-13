'use client';

import { useState } from 'react';
import {
  PawPrint,
  Plus,
  Search,
  Filter,
  Weight,
  Calendar,
  Cpu,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField';
import { DataTable } from '@/components/ui/DataTable';
import { mockAnimals } from '@/lib/mock-data';
import { formatDate, getStatusBadgeColor } from '@/lib/utils';
import type { Animal } from '@/lib/types';

export default function AnimalsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const filtered = mockAnimals.filter(a => {
    const matchesSearch = `${a.name} ${a.animalId} ${a.breed}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSpecies = speciesFilter === 'all' || a.species === speciesFilter;
    return matchesSearch && matchesStatus && matchesSpecies;
  });

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (a: Animal) => (
        <span className="font-mono text-xs text-muted">{a.animalId}</span>
      ),
    },
    {
      key: 'name',
      header: 'Animal',
      render: (a: Animal) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
            <PawPrint className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium">{a.name}</p>
            <p className="text-xs text-muted">{a.breed}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'species',
      header: 'Species',
      hideOnMobile: true,
      render: (a: Animal) => <span className="capitalize">{a.species}</span>,
    },
    {
      key: 'details',
      header: 'Details',
      hideOnMobile: true,
      render: (a: Animal) => (
        <div className="text-sm">
          <span className="capitalize">{a.gender}</span> &middot; {a.size} &middot; {a.age || 'Unknown'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a: Animal) => <Badge className={getStatusBadgeColor(a.status)}>{a.status.replace('-', ' ')}</Badge>,
    },
    {
      key: 'intake',
      header: 'Intake',
      hideOnMobile: true,
      render: (a: Animal) => (
        <div>
          <p className="text-sm">{formatDate(a.intakeDate)}</p>
          <p className="text-xs text-muted capitalize">{a.intakeType}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Animals</h1>
          <p className="text-muted text-sm mt-1">Track and manage shelter animals</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Intake Animal
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {(['intake', 'available', 'adopted', 'foster', 'medical-hold', 'transferred', 'deceased'] as const).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className={`p-3 rounded-lg border text-center transition-colors ${
              statusFilter === status
                ? 'border-primary bg-primary/10'
                : 'border-border bg-surface hover:bg-surface-hover'
            }`}
          >
            <p className="text-lg font-bold">{mockAnimals.filter(a => a.status === status).length}</p>
            <p className="text-xs text-muted capitalize">{status.replace('-', ' ')}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search by name, ID, or breed..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={speciesFilter} onChange={e => setSpeciesFilter(e.target.value)} className="w-32">
                <option value="all">All Species</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="bird">Birds</option>
                <option value="rabbit">Rabbits</option>
                <option value="other">Other</option>
              </Select>
              {statusFilter !== 'all' && (
                <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')}>Clear</Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(a) => a.id}
          onRowClick={(a) => setSelectedAnimal(a)}
        />
      </Card>

      {/* Add Animal Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Animal Intake" size="lg">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddModal(false); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Name" required>
              <Input placeholder="Animal name" required />
            </FormField>
            <FormField label="Species" required>
              <Select required>
                <option value="">Select species</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </Select>
            </FormField>
            <FormField label="Breed" required>
              <Input placeholder="Breed" required />
            </FormField>
            <FormField label="Color" required>
              <Input placeholder="Color/markings" required />
            </FormField>
            <FormField label="Gender" required>
              <Select required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </Select>
            </FormField>
            <FormField label="Size" required>
              <Select required>
                <option value="">Select size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </Select>
            </FormField>
            <FormField label="Age">
              <Input placeholder="e.g., 2 years" />
            </FormField>
            <FormField label="Weight (lbs)">
              <Input type="number" placeholder="Weight" />
            </FormField>
            <FormField label="Microchip ID">
              <Input placeholder="Microchip number" />
            </FormField>
            <FormField label="Intake Type" required>
              <Select required>
                <option value="">Select intake type</option>
                <option value="stray">Stray</option>
                <option value="surrender">Owner Surrender</option>
                <option value="transfer">Transfer</option>
                <option value="return">Return</option>
                <option value="confiscation">Confiscation</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Description" required>
            <Textarea placeholder="Physical description, temperament, notes..." rows={3} required />
          </FormField>
          <FormField label="Intake Person (if surrender/drop-off)">
            <Input placeholder="Search person by name..." />
          </FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Complete Intake</Button>
          </div>
        </form>
      </Modal>

      {/* Animal Detail Modal */}
      <Modal open={!!selectedAnimal} onClose={() => setSelectedAnimal(null)} title={selectedAnimal?.name || ''} size="lg">
        {selectedAnimal && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <PawPrint className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedAnimal.name}</h3>
                  <p className="text-sm font-mono text-muted">{selectedAnimal.animalId}</p>
                  <Badge className={getStatusBadgeColor(selectedAnimal.status)}>{selectedAnimal.status.replace('-', ' ')}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-surface-hover text-center">
                <p className="text-xs text-muted">Species</p>
                <p className="font-medium capitalize">{selectedAnimal.species}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-hover text-center">
                <p className="text-xs text-muted">Breed</p>
                <p className="font-medium">{selectedAnimal.breed}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-hover text-center">
                <p className="text-xs text-muted">Gender / Size</p>
                <p className="font-medium capitalize">{selectedAnimal.gender} / {selectedAnimal.size}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-hover text-center">
                <p className="text-xs text-muted">Age</p>
                <p className="font-medium">{selectedAnimal.age || 'Unknown'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-muted" />
                <span>{selectedAnimal.weight ? `${selectedAnimal.weight} lbs` : 'No weight'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-muted" />
                <span>{selectedAnimal.microchipId || 'No microchip'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted" />
                <span>Intake: {formatDate(selectedAnimal.intakeDate)}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted">{selectedAnimal.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Intake Details</h4>
              <div className="p-3 rounded-lg bg-surface-hover">
                <p className="text-sm capitalize"><strong>Type:</strong> {selectedAnimal.intakeType}</p>
                {selectedAnimal.intakePersonName && (
                  <p className="text-sm mt-1"><strong>Person:</strong> {selectedAnimal.intakePersonName}</p>
                )}
              </div>
            </div>

            {selectedAnimal.medicalNotes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Medical Notes</h4>
                <ul className="space-y-1">
                  {selectedAnimal.medicalNotes.map((note, i) => (
                    <li key={i} className="text-sm text-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedAnimal.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAnimal.tags.map(tag => (
                    <Badge key={tag} className="bg-primary/10 text-primary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
