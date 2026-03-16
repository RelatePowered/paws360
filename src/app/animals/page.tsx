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
  Camera,
  Stethoscope,
  MapPin,
  Printer,
  Shield,
  Scissors,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField';
import { DataTable } from '@/components/ui/DataTable';
import AnimalPhoto from '@/components/ui/AnimalPhoto';
import PhotoUpload from '@/components/ui/PhotoUpload';
import SocialPostPanel from '@/components/ui/SocialPostPanel';
import { useAnimals, useMedicalRecords } from '@/hooks/useTenantData';
import { useAuth } from '@/context/AuthContext';
import { formatDate, getStatusBadgeColor } from '@/lib/utils';
import type { Animal, MedicalRecord } from '@/lib/types';

function getConditionBadgeColor(condition: string): string {
  switch (condition) {
    case 'healthy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'treatable-rehabilitable': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'treatable-manageable': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'unhealthy-untreatable': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

function getMedicalTypeBadgeColor(type: string): string {
  switch (type) {
    case 'vaccination': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'surgery': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'treatment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'exam': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'medication': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'test': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

function CageCard({ animal }: { animal: Animal }) {
  const daysInCare = Math.ceil(
    (new Date().getTime() - new Date(animal.intakeDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="cage-card border-2 border-black p-4 bg-white text-black rounded-lg max-w-md print:max-w-full print:border-3">
      <div className="flex items-start justify-between border-b-2 border-black pb-2 mb-3">
        <div>
          <h2 className="text-2xl font-bold">{animal.name}</h2>
          <p className="text-sm font-mono">{animal.animalId}</p>
        </div>
        <div className="text-right">
          <Badge className={getConditionBadgeColor(animal.intakeCondition)}>
            {animal.intakeCondition.replace(/-/g, ' ')}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div><strong>Species:</strong> <span className="capitalize">{animal.species}</span></div>
        <div><strong>Breed:</strong> {animal.breed}</div>
        <div><strong>Gender:</strong> <span className="capitalize">{animal.gender}</span></div>
        <div><strong>Size:</strong> <span className="capitalize">{animal.size}</span></div>
        <div><strong>Age:</strong> {animal.age || 'Unknown'}</div>
        <div><strong>Weight:</strong> {animal.weight ? `${animal.weight} lbs` : 'N/A'}</div>
        <div><strong>Color:</strong> {animal.color}</div>
        <div><strong>Altered:</strong> <span className="capitalize">{animal.alteredStatus}</span></div>
      </div>
      <div className="border-t-2 border-black pt-2 text-sm space-y-1">
        <div className="flex justify-between">
          <span><strong>Intake:</strong> {formatDate(animal.intakeDate)}</span>
          <span><strong>Days:</strong> {daysInCare}</span>
        </div>
        <div><strong>Type:</strong> <span className="capitalize">{animal.intakeType}</span></div>
        {animal.kennelLocation && <div><strong>Location:</strong> {animal.kennelLocation}</div>}
        {animal.holdExpirationDate && (
          <div className="text-red-700 font-medium"><strong>Hold expires:</strong> {formatDate(animal.holdExpirationDate)}</div>
        )}
        {animal.microchipId && <div><strong>Microchip:</strong> {animal.microchipId}</div>}
      </div>
      {animal.medicalNotes.length > 0 && (
        <div className="border-t-2 border-black pt-2 mt-2 text-sm">
          <strong>Medical:</strong>
          <ul className="list-disc list-inside">
            {animal.medicalNotes.map((note, i) => <li key={i}>{note}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AnimalsPage() {
  const allAnimals = useAnimals();
  const allMedicalRecords = useMedicalRecords();
  const { currentUser, currentTenant } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'medical' | 'cage-card'>('info');
  const [newAnimalPhotoKey, setNewAnimalPhotoKey] = useState<string | null>(null);

  const filtered = allAnimals.filter(a => {
    const matchesSearch = `${a.name} ${a.animalId} ${a.breed}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSpecies = speciesFilter === 'all' || a.species === speciesFilter;
    return matchesSearch && matchesStatus && matchesSpecies;
  });

  const animalMedicalRecords = selectedAnimal
    ? allMedicalRecords.filter(r => r.animalId === selectedAnimal.id).sort((a, b) => b.date.localeCompare(a.date))
    : [];

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
          <AnimalPhoto photoKey={a.photoUrl} alt={a.name} size="sm" />
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
      key: 'condition',
      header: 'Condition',
      hideOnMobile: true,
      render: (a: Animal) => (
        <Badge className={getConditionBadgeColor(a.intakeCondition)}>
          {a.intakeCondition === 'healthy' ? 'Healthy' :
           a.intakeCondition === 'treatable-rehabilitable' ? 'Rehab' :
           a.intakeCondition === 'treatable-manageable' ? 'Manage' : 'Untreatable'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a: Animal) => <Badge className={getStatusBadgeColor(a.status)}>{a.status.replace('-', ' ')}</Badge>,
    },
    {
      key: 'location',
      header: 'Location',
      hideOnMobile: true,
      render: (a: Animal) => (
        <span className="text-sm font-mono">
          {a.status === 'foster' ? 'Foster' : a.kennelLocation || '—'}
        </span>
      ),
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {(['intake', 'available', 'adopted', 'foster', 'medical-hold', 'transferred', 'euthanized', 'deceased'] as const).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className={`p-3 rounded-lg border text-center transition-colors ${
              statusFilter === status
                ? 'border-primary bg-primary/10'
                : 'border-border bg-surface hover:bg-surface-hover'
            }`}
          >
            <p className="text-lg font-bold">{allAnimals.filter(a => a.status === status).length}</p>
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
          onRowClick={(a) => { setSelectedAnimal(a); setDetailTab('info'); }}
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
            <FormField label="Date of Birth">
              <Input type="date" />
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
            <FormField label="Intake Condition (Asilomar)" required>
              <Select required>
                <option value="">Select condition</option>
                <option value="healthy">Healthy</option>
                <option value="treatable-rehabilitable">Treatable - Rehabilitable</option>
                <option value="treatable-manageable">Treatable - Manageable</option>
                <option value="unhealthy-untreatable">Unhealthy / Untreatable</option>
              </Select>
            </FormField>
            <FormField label="Altered Status" required>
              <Select required>
                <option value="">Select status</option>
                <option value="intact">Intact</option>
                <option value="spayed">Spayed</option>
                <option value="neutered">Neutered</option>
                <option value="unknown">Unknown</option>
              </Select>
            </FormField>
            <FormField label="Kennel Location">
              <Input placeholder="e.g., D-101" />
            </FormField>
          </div>
          <FormField label="Description" required>
            <Textarea placeholder="Physical description, temperament, notes..." rows={3} required />
          </FormField>
          <FormField label="Intake Person (if surrender/drop-off)">
            <Input placeholder="Search person by name..." />
          </FormField>
          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            <PhotoUpload
              tenantId={currentUser?.tenantId ?? ''}
              animalId="new"
              onUploaded={(key) => setNewAnimalPhotoKey(key)}
            />
          </div>
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
            {/* Tab Navigation */}
            <div className="flex gap-1 border-b border-border">
              {([
                { key: 'info' as const, label: 'Details' },
                { key: 'medical' as const, label: 'Medical Records' },
                { key: 'cage-card' as const, label: 'Cage Card' },
              ]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setDetailTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    detailTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Info Tab */}
            {detailTab === 'info' && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <AnimalPhoto photoKey={selectedAnimal.photoUrl} alt={selectedAnimal.name} size="md" />
                    <div>
                      <h3 className="text-lg font-bold">{selectedAnimal.name}</h3>
                      <p className="text-sm font-mono text-muted">{selectedAnimal.animalId}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getStatusBadgeColor(selectedAnimal.status)}>{selectedAnimal.status.replace('-', ' ')}</Badge>
                        <Badge className={getConditionBadgeColor(selectedAnimal.intakeCondition)}>
                          {selectedAnimal.intakeCondition.replace(/-/g, ' ')}
                        </Badge>
                      </div>
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
                    <Scissors className="w-4 h-4 text-muted" />
                    <span className="capitalize">{selectedAnimal.alteredStatus}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span>Intake: {formatDate(selectedAnimal.intakeDate)}</span>
                  </div>
                  {selectedAnimal.kennelLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted" />
                      <span>Kennel: {selectedAnimal.kennelLocation}</span>
                    </div>
                  )}
                  {selectedAnimal.holdExpirationDate && (
                    <div className="flex items-center gap-2 text-warning">
                      <Clock className="w-4 h-4" />
                      <span>Hold expires: {formatDate(selectedAnimal.holdExpirationDate)}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted">{selectedAnimal.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Intake Details</h4>
                  <div className="p-3 rounded-lg bg-surface-hover space-y-1">
                    <p className="text-sm capitalize"><strong>Type:</strong> {selectedAnimal.intakeType}</p>
                    <p className="text-sm"><strong>Condition:</strong> <span className="capitalize">{selectedAnimal.intakeCondition.replace(/-/g, ' ')}</span></p>
                    {selectedAnimal.intakePersonName && (
                      <p className="text-sm"><strong>Person:</strong> {selectedAnimal.intakePersonName}</p>
                    )}
                  </div>
                </div>

                {selectedAnimal.outcomeType && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Outcome</h4>
                    <div className="p-3 rounded-lg bg-surface-hover space-y-1">
                      <p className="text-sm capitalize"><strong>Type:</strong> {selectedAnimal.outcomeType.replace(/-/g, ' ')}</p>
                      {selectedAnimal.outcomeDate && (
                        <p className="text-sm"><strong>Date:</strong> {formatDate(selectedAnimal.outcomeDate)}</p>
                      )}
                    </div>
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

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Photo
                  </h4>
                  <PhotoUpload
                    tenantId={currentUser?.tenantId ?? ''}
                    animalId={selectedAnimal.id}
                    currentPhotoKey={selectedAnimal.photoUrl}
                    onUploaded={(key) => {
                      setSelectedAnimal({ ...selectedAnimal, photoUrl: key });
                    }}
                  />
                </div>

                <SocialPostPanel
                  animal={selectedAnimal}
                  shelterName={currentTenant?.name ?? 'Our Shelter'}
                />
              </>
            )}

            {/* Medical Records Tab */}
            {detailTab === 'medical' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Medical Records for {selectedAnimal.name}
                  </h3>
                </div>

                {animalMedicalRecords.length === 0 ? (
                  <p className="text-muted text-sm text-center py-8">No medical records yet</p>
                ) : (
                  <div className="space-y-3">
                    {animalMedicalRecords.map(record => (
                      <div key={record.id} className="p-3 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge className={getMedicalTypeBadgeColor(record.type)}>{record.type}</Badge>
                            <span className="font-medium text-sm">{record.description}</span>
                          </div>
                          <span className="text-xs text-muted">{formatDate(record.date)}</span>
                        </div>
                        {record.veterinarian && (
                          <p className="text-xs text-muted">Vet: {record.veterinarian}</p>
                        )}
                        {record.notes && (
                          <p className="text-sm text-muted mt-1">{record.notes}</p>
                        )}
                        {record.nextDueDate && (
                          <p className="text-xs text-warning mt-1">Next due: {formatDate(record.nextDueDate)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cage Card Tab */}
            {detailTab === 'cage-card' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between" data-print-hide>
                  <h3 className="font-medium flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Cage Card Preview
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                </div>
                <CageCard animal={selectedAnimal} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
