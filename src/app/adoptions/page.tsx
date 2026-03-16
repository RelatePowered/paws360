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
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  DollarSign,
  ClipboardList,
  Download,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField';
import { DataTable } from '@/components/ui/DataTable';
import {
  useAdopters, useAdoptions, useTags, useAnimals, useAdoptionApplications,
} from '@/hooks/useTenantData';
import { formatCurrency, formatDate, getSeverityColor } from '@/lib/utils';
import type { Adopter, Adoption, AdoptionApplication } from '@/lib/types';

function getAppStatusColor(status: string): string {
  switch (status) {
    case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'under-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'denied': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'withdrawn': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

export default function AdoptionsPage() {
  const allAdopters = useAdopters();
  const allAdoptions = useAdoptions();
  const allTags = useTags();
  const allAnimals = useAnimals();
  const allApplications = useAdoptionApplications();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'applications' | 'adopters' | 'adoptions'>('applications');
  const [showAddAdopterModal, setShowAddAdopterModal] = useState(false);
  const [showAddAdoptionModal, setShowAddAdoptionModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedAdopter, setSelectedAdopter] = useState<Adopter | null>(null);
  const [selectedApp, setSelectedApp] = useState<AdoptionApplication | null>(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteAdopter, setNoteAdopter] = useState<Adopter | null>(null);

  const adopterAlertTags = allTags.filter(t => t.category === 'adopter');
  const availableAnimals = allAnimals.filter(a => a.status === 'available');

  const pendingApps = allApplications.filter(a => a.status === 'submitted' || a.status === 'under-review');
  const approvedApps = allApplications.filter(a => a.status === 'approved');

  const filteredAdopters = allAdopters.filter(a =>
    `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAdoptions = allAdoptions.filter(a =>
    `${a.animalName} ${a.adopterName}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredApps = allApplications.filter(a =>
    `${a.applicantName} ${a.animalName}`.toLowerCase().includes(search.toLowerCase())
  );

  const applicationColumns = [
    {
      key: 'status',
      header: 'Status',
      render: (a: AdoptionApplication) => (
        <Badge className={getAppStatusColor(a.status)}>
          {a.status.replace('-', ' ')}
        </Badge>
      ),
    },
    {
      key: 'applicant',
      header: 'Applicant',
      render: (a: AdoptionApplication) => (
        <div>
          <p className="font-medium text-sm">{a.applicantName}</p>
          <p className="text-xs text-muted">{a.applicantEmail}</p>
        </div>
      ),
    },
    {
      key: 'animal',
      header: 'Animal',
      render: (a: AdoptionApplication) => <p className="text-sm font-medium">{a.animalName}</p>,
    },
    {
      key: 'housing',
      header: 'Housing',
      hideOnMobile: true,
      render: (a: AdoptionApplication) => (
        <div className="text-xs">
          <span className="capitalize">{a.householdType}</span>
          {a.hasYard && ' + yard'}
          {a.hasFence && ' + fence'}
        </div>
      ),
    },
    {
      key: 'submitted',
      header: 'Submitted',
      hideOnMobile: true,
      render: (a: AdoptionApplication) => <span className="text-sm">{formatDate(a.submittedAt)}</span>,
    },
  ];

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
      key: 'donation',
      header: 'Donation',
      hideOnMobile: true,
      render: (a: Adoption) => (
        a.checkoutDonation ? (
          <span className="text-sm text-green-600 dark:text-green-400">{formatCurrency(a.checkoutDonation)}</span>
        ) : <span className="text-xs text-muted">—</span>
      ),
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
          <p className="text-muted text-sm mt-1">Manage applications, adopters, and adoption records</p>
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

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {allApplications.filter(a => a.status === 'submitted').length}
          </p>
          <p className="text-xs text-muted">New Applications</p>
        </div>
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-center">
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {allApplications.filter(a => a.status === 'under-review').length}
          </p>
          <p className="text-xs text-muted">Under Review</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {approvedApps.length}
          </p>
          <p className="text-xs text-muted">Approved</p>
        </div>
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {allAdoptions.filter(a => a.status === 'completed').length}
          </p>
          <p className="text-xs text-muted">Completed</p>
        </div>
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            {allAdoptions.filter(a => a.status === 'returned').length}
          </p>
          <p className="text-xs text-muted">Returned</p>
        </div>
      </div>

      {/* Alert banner for flagged adopters */}
      {allAdopters.filter(a => a.flagged).length > 0 && (
        <div className="p-4 rounded-lg bg-danger/5 border border-danger/20 flex items-start gap-3">
          <Shield className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-danger">
              {allAdopters.filter(a => a.flagged).length} Flagged Adopter(s)
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
          onClick={() => setTab('applications')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'applications' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <ClipboardList className="w-4 h-4 inline mr-1" />
          Applications ({allApplications.length})
          {pendingApps.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              {pendingApps.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('adopters')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'adopters' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          Adopters ({allAdopters.length})
        </button>
        <button
          onClick={() => setTab('adoptions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'adoptions' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          Adoptions ({allAdoptions.length})
        </button>
      </div>

      {/* Search */}
      <Card>
        <CardBody>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder={
                tab === 'applications' ? 'Search applications...' :
                tab === 'adopters' ? 'Search adopters...' : 'Search adoptions...'
              }
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        {tab === 'applications' ? (
          <DataTable
            columns={applicationColumns}
            data={filteredApps}
            keyExtractor={(a) => a.id}
            onRowClick={(a) => setSelectedApp(a)}
          />
        ) : tab === 'adopters' ? (
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

      {/* Application Detail Modal */}
      <Modal open={!!selectedApp} onClose={() => setSelectedApp(null)} title="Adoption Application" size="lg">
        {selectedApp && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{selectedApp.applicantName}</h3>
                <p className="text-sm text-muted">{selectedApp.applicantEmail} &middot; {selectedApp.applicantPhone}</p>
              </div>
              <Badge className={getAppStatusColor(selectedApp.status)}>
                {selectedApp.status.replace('-', ' ')}
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm"><strong>Applying for:</strong> {selectedApp.animalName}</p>
              <p className="text-xs text-muted">Submitted {formatDate(selectedApp.submittedAt)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted">Housing</p>
                <p className="font-medium capitalize">{selectedApp.householdType}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Yard / Fence</p>
                <p className="font-medium">
                  {selectedApp.hasYard ? 'Has yard' : 'No yard'}
                  {selectedApp.hasFence ? ' + fenced' : ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Other Pets</p>
                <p className="font-medium">{selectedApp.otherPets}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Children</p>
                <p className="font-medium">
                  {selectedApp.hasChildren ? `Yes (ages: ${selectedApp.childrenAges || 'not specified'})` : 'No'}
                </p>
              </div>
              {selectedApp.veterinarianName && (
                <div className="col-span-2">
                  <p className="text-xs text-muted">Veterinarian Reference</p>
                  <p className="font-medium">{selectedApp.veterinarianName} — {selectedApp.veterinarianPhone}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-muted mb-1">Experience with Animals</p>
              <p className="text-sm">{selectedApp.experience}</p>
            </div>

            <div>
              <p className="text-xs text-muted mb-1">Reason for Adopting</p>
              <p className="text-sm">{selectedApp.reasonForAdopting}</p>
            </div>

            {selectedApp.address && (
              <div>
                <p className="text-xs text-muted mb-1">Address</p>
                <p className="text-sm">
                  {[selectedApp.address, selectedApp.city, selectedApp.state, selectedApp.zip].filter(Boolean).join(', ')}
                </p>
              </div>
            )}

            {selectedApp.reviewNotes && (
              <div className="p-3 rounded-lg bg-surface-hover">
                <p className="text-xs text-muted mb-1">Review Notes</p>
                <p className="text-sm">{selectedApp.reviewNotes}</p>
                {selectedApp.reviewedBy && (
                  <p className="text-xs text-muted mt-1">Reviewed by {selectedApp.reviewedBy} on {selectedApp.reviewedAt ? formatDate(selectedApp.reviewedAt) : '—'}</p>
                )}
              </div>
            )}

            {/* Action buttons for pending applications */}
            {(selectedApp.status === 'submitted' || selectedApp.status === 'under-review') && (
              <div className="flex gap-2 pt-4 border-t border-border">
                {selectedApp.status === 'submitted' && (
                  <Button variant="outline" onClick={() => setSelectedApp({ ...selectedApp, status: 'under-review' })}>
                    <Eye className="w-4 h-4" />
                    Begin Review
                  </Button>
                )}
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setSelectedApp({ ...selectedApp, status: 'approved' })}>
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </Button>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => setSelectedApp({ ...selectedApp, status: 'denied' })}>
                  <XCircle className="w-4 h-4" />
                  Deny
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

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

      {/* Add Adoption Modal with Checkout Donation */}
      <Modal open={showAddAdoptionModal} onClose={() => setShowAddAdoptionModal(false)} title="New Adoption" size="md">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddAdoptionModal(false); setShowCheckoutModal(true); }}>
          <FormField label="Animal" required>
            <Select required>
              <option value="">Select animal...</option>
              {availableAnimals.map(a => (
                <option key={a.id} value={a.id}>{a.animalId} - {a.name} ({a.breed})</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Adopter" required>
            <Select required>
              <option value="">Select adopter...</option>
              {allAdopters.map(a => (
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
            <Button type="submit">Continue to Checkout</Button>
          </div>
        </form>
      </Modal>

      {/* Point-of-Adoption Donation Modal */}
      <Modal open={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} title="Adoption Checkout" size="md">
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); setShowCheckoutModal(false); }}>
          <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/20">
            <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="text-lg font-bold">Adoption Complete!</h3>
            <p className="text-sm text-muted mt-1">
              Would the adopter like to make a donation to help more animals?
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Suggested donation amounts:</p>
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map(amount => (
                <button
                  key={amount}
                  type="button"
                  className="p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-center transition-colors"
                >
                  <p className="text-lg font-bold">${amount}</p>
                </button>
              ))}
            </div>
            <FormField label="Custom amount">
              <Input type="number" step="0.01" placeholder="Other amount..." />
            </FormField>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-sm text-center">
            <DollarSign className="w-4 h-4 inline text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-300">
              30% of adopters choose to donate at checkout
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowCheckoutModal(false)}>
              Skip — No Donation
            </Button>
            <Button type="submit">
              <DollarSign className="w-4 h-4" />
              Complete with Donation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
