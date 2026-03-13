'use client';

import { useState } from 'react';
import {
  Heart,
  Plus,
  Search,
  AlertTriangle,
  Shield,
  UserCheck,
  RotateCcw,
  Tag,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { DataTable } from '@/components/ui/DataTable';
import { mockAdopters, mockAdoptions, mockTags } from '@/lib/mock-data';
import { formatCurrency, formatDate, getSeverityColor } from '@/lib/utils';
import type { Adopter, Adoption } from '@/lib/types';

export default function AdoptionsPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'adopters' | 'adoptions'>('adopters');
  const [showAddAdopterModal, setShowAddAdopterModal] = useState(false);
  const [showAddAdoptionModal, setShowAddAdoptionModal] = useState(false);
  const [selectedAdopter, setSelectedAdopter] = useState<Adopter | null>(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteAdopter, setNoteAdopter] = useState<Adopter | null>(null);

  const adopterAlertTags = mockTags.filter(t => t.category === 'adopter');

  const filteredAdopters = mockAdopters.filter(a =>
    `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAdoptions = mockAdoptions.filter(a =>
    `${a.animalName} ${a.adopterName}`.toLowerCase().includes(search.toLowerCase())
  );

  const adopterColumns = [
    {
      key: 'name',
      header: 'Adopter',
      render: (a: Adopter) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
            a.flagged ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
          }`}>
            {a.firstName[0]}{a.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{a.firstName} {a.lastName}</p>
              {a.flagged && <AlertTriangle className="w-4 h-4 text-danger" />}
            </div>
            <p className="text-xs text-muted">{a.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'notes',
      header: 'Notes / Alerts',
      render: (a: Adopter) => (
        <div className="flex flex-wrap gap-1">
          {a.structuredNotes.length === 0 ? (
            <span className="text-xs text-muted">No notes</span>
          ) : (
            a.structuredNotes.map(note => (
              <Badge key={note.id} className={getSeverityColor(note.severity)}>
                {note.tagLabel}
              </Badge>
            ))
          )}
        </div>
      ),
    },
    {
      key: 'returns',
      header: 'Returns',
      hideOnMobile: true,
      render: (a: Adopter) => (
        <div className="flex items-center gap-1">
          {a.returnHistory.length > 0 ? (
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              <RotateCcw className="w-3 h-3 mr-1" />
              {a.returnHistory.length}
            </Badge>
          ) : (
            <span className="text-xs text-muted">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (a: Adopter) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setNoteAdopter(a);
            setShowAddNoteModal(true);
          }}
          title="Add structured note"
        >
          <Tag className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const adoptionColumns = [
    {
      key: 'date',
      header: 'Date',
      render: (a: Adoption) => <span className="text-sm">{formatDate(a.date)}</span>,
    },
    {
      key: 'animal',
      header: 'Animal',
      render: (a: Adoption) => <p className="font-medium text-sm">{a.animalName}</p>,
    },
    {
      key: 'adopter',
      header: 'Adopter',
      render: (a: Adoption) => <p className="text-sm">{a.adopterName}</p>,
    },
    {
      key: 'fee',
      header: 'Fee',
      hideOnMobile: true,
      render: (a: Adoption) => <span className="text-sm">{formatCurrency(a.fee)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (a: Adoption) => (
        <Badge className={
          a.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
          a.status === 'returned' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        }>
          {a.status}
        </Badge>
      ),
    },
    {
      key: 'return',
      header: 'Return Info',
      hideOnMobile: true,
      render: (a: Adoption) => (
        a.returnDate ? (
          <div>
            <p className="text-xs">{formatDate(a.returnDate)}</p>
            <p className="text-xs text-muted">{a.returnReason}</p>
          </div>
        ) : <span className="text-xs text-muted">—</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Adoptions</h1>
          <p className="text-muted text-sm mt-1">Manage adopters and adoption records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddAdopterModal(true)}>
            <UserCheck className="w-4 h-4" />
            New Adopter
          </Button>
          <Button onClick={() => setShowAddAdoptionModal(true)}>
            <Plus className="w-4 h-4" />
            New Adoption
          </Button>
        </div>
      </div>

      {/* Alert banner for flagged adopters */}
      {mockAdopters.filter(a => a.flagged).length > 0 && (
        <div className="p-4 rounded-lg bg-danger/5 border border-danger/20 flex items-start gap-3">
          <Shield className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-danger">
              {mockAdopters.filter(a => a.flagged).length} Flagged Adopter(s)
            </p>
            <p className="text-xs text-muted mt-1">
              Review flagged adopters before approving new adoptions.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-hover rounded-lg w-fit">
        <button
          onClick={() => setTab('adopters')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'adopters' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          Adopters ({mockAdopters.length})
        </button>
        <button
          onClick={() => setTab('adoptions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'adoptions' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          Adoptions ({mockAdoptions.length})
        </button>
      </div>

      {/* Search */}
      <Card>
        <CardBody>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder={tab === 'adopters' ? 'Search adopters...' : 'Search adoptions...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        {tab === 'adopters' ? (
          <DataTable
            columns={adopterColumns}
            data={filteredAdopters}
            keyExtractor={(a) => a.id}
            onRowClick={(a) => setSelectedAdopter(a)}
          />
        ) : (
          <DataTable
            columns={adoptionColumns}
            data={filteredAdoptions}
            keyExtractor={(a) => a.id}
          />
        )}
      </Card>

      {/* Adopter Detail Modal */}
      <Modal open={!!selectedAdopter} onClose={() => setSelectedAdopter(null)} title={selectedAdopter ? `${selectedAdopter.firstName} ${selectedAdopter.lastName}` : ''} size="lg">
        {selectedAdopter && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-medium ${
                selectedAdopter.flagged ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
              }`}>
                {selectedAdopter.firstName[0]}{selectedAdopter.lastName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{selectedAdopter.firstName} {selectedAdopter.lastName}</h3>
                  {selectedAdopter.flagged && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      <AlertTriangle className="w-3 h-3 mr-1" />Flagged
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted">{selectedAdopter.email} &middot; {selectedAdopter.phone}</p>
              </div>
            </div>

            {/* Structured Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Structured Notes</h4>
                <Button size="sm" variant="outline" onClick={() => {
                  setNoteAdopter(selectedAdopter);
                  setShowAddNoteModal(true);
                }}>
                  <Tag className="w-3 h-3" />Add Note
                </Button>
              </div>
              {selectedAdopter.structuredNotes.length === 0 ? (
                <p className="text-sm text-muted">No structured notes</p>
              ) : (
                <div className="space-y-2">
                  {selectedAdopter.structuredNotes.map(note => (
                    <div key={note.id} className={`p-3 rounded-lg border ${
                      note.severity === 'critical' ? 'bg-danger/5 border-danger/20' :
                      note.severity === 'warning' ? 'bg-warning/5 border-warning/20' :
                      'bg-info/5 border-info/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <Badge className={getSeverityColor(note.severity)}>{note.tagLabel}</Badge>
                        <span className="text-xs text-muted">{formatDate(note.date)} by {note.addedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Return History */}
            {selectedAdopter.returnHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-danger flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" />
                  Return History ({selectedAdopter.returnHistory.length})
                </h4>
                <div className="space-y-2">
                  {selectedAdopter.returnHistory.map(ret => (
                    <div key={ret.id} className="p-3 rounded-lg bg-danger/5 border border-danger/20">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{ret.animalName}</p>
                        <span className="text-xs text-muted">{formatDate(ret.date)}</span>
                      </div>
                      <Badge className="mt-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">{ret.reasonLabel}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Structured Note Modal */}
      <Modal open={showAddNoteModal} onClose={() => { setShowAddNoteModal(false); setNoteAdopter(null); }} title="Add Structured Note" size="sm">
        {noteAdopter && (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddNoteModal(false); setNoteAdopter(null); }}>
            <p className="text-sm">
              Adding note for <strong>{noteAdopter.firstName} {noteAdopter.lastName}</strong>
            </p>
            <FormField label="Select Tag" required>
              <Select required>
                <option value="">Choose a tag...</option>
                {adopterAlertTags.map(tag => (
                  <option key={tag.id} value={tag.id}>
                    [{tag.severity?.toUpperCase()}] {tag.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Added By" required>
              <Select required>
                <option value="">Select staff</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="System">System</option>
              </Select>
            </FormField>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" type="button" onClick={() => { setShowAddNoteModal(false); setNoteAdopter(null); }}>Cancel</Button>
              <Button type="submit">Add Note</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Adopter Modal */}
      <Modal open={showAddAdopterModal} onClose={() => setShowAddAdopterModal(false)} title="New Adopter" size="lg">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddAdopterModal(false); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name" required><Input placeholder="First name" required /></FormField>
            <FormField label="Last Name" required><Input placeholder="Last name" required /></FormField>
            <FormField label="Email" required><Input type="email" placeholder="email@example.com" required /></FormField>
            <FormField label="Phone" required><Input placeholder="(555) 000-0000" required /></FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Address" className="sm:col-span-3"><Input placeholder="Street address" /></FormField>
            <FormField label="City"><Input placeholder="City" /></FormField>
            <FormField label="State"><Input placeholder="State" /></FormField>
            <FormField label="ZIP"><Input placeholder="ZIP" /></FormField>
          </div>
          <FormField label="Initial Notes">
            <Select>
              <option value="">No initial notes</option>
              {adopterAlertTags.map(tag => (
                <option key={tag.id} value={tag.id}>[{tag.severity?.toUpperCase()}] {tag.label}</option>
              ))}
            </Select>
          </FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddAdopterModal(false)}>Cancel</Button>
            <Button type="submit">Add Adopter</Button>
          </div>
        </form>
      </Modal>

      {/* Add Adoption Modal */}
      <Modal open={showAddAdoptionModal} onClose={() => setShowAddAdoptionModal(false)} title="New Adoption" size="md">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddAdoptionModal(false); }}>
          <FormField label="Animal" required>
            <Select required>
              <option value="">Select animal...</option>
              <option value="a-1">DOG-2024-0042 - Buddy (Golden Retriever)</option>
              <option value="a-3">DOG-2024-0067 - Luna (Labrador Mix)</option>
            </Select>
          </FormField>
          <FormField label="Adopter" required>
            <Select required>
              <option value="">Select adopter...</option>
              {mockAdopters.map(a => (
                <option key={a.id} value={a.id}>
                  {a.flagged ? '⚠ ' : ''}{a.firstName} {a.lastName}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Adoption Date" required><Input type="date" required /></FormField>
            <FormField label="Adoption Fee ($)" required><Input type="number" step="0.01" placeholder="0.00" required /></FormField>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddAdoptionModal(false)}>Cancel</Button>
            <Button type="submit">Complete Adoption</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
