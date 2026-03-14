'use client';

import { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  DollarSign,
  Clock,
  Gift,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { DataTable } from '@/components/ui/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { mockOrganizations, mockPeople, mockDonations } from '@/lib/mock-data';
import { formatCurrency, formatDate, getRoleBadgeColor } from '@/lib/utils';
import type { Organization } from '@/lib/types';

const orgTypeLabels: Record<string, string> = {
  corporation: 'Corporation',
  foundation: 'Foundation',
  nonprofit: 'Nonprofit',
  'small-business': 'Small Business',
  other: 'Other',
};

function getOrgTypeColor(type: string): string {
  switch (type) {
    case 'corporation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'foundation': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'nonprofit': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'small-business': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

export default function OrganizationsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const filtered = mockOrganizations.filter(o => {
    const matchesSearch = `${o.name} ${o.contactName} ${o.contactEmail}`.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || o.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCorpDonations = mockOrganizations.reduce((s, o) => s + o.totalDonations, 0);
  const totalCorpHours = mockOrganizations.reduce((s, o) => s + o.totalVolunteerHours, 0);
  const matchingOrgs = mockOrganizations.filter(o => o.matchingGiftProgram).length;

  const columns = [
    {
      key: 'name',
      header: 'Organization',
      render: (o: Organization) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium">{o.name}</p>
            <p className="text-xs text-muted">{o.contactName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (o: Organization) => (
        <Badge className={getOrgTypeColor(o.type)}>{orgTypeLabels[o.type]}</Badge>
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      hideOnMobile: true,
      render: (o: Organization) => (
        <div className="flex gap-1 flex-wrap">
          {o.roles.map(r => (
            <Badge key={r} className={getRoleBadgeColor(r)}>{r}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'members',
      header: 'People',
      hideOnMobile: true,
      render: (o: Organization) => (
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-muted" />
          <span>{o.memberIds.length}</span>
        </div>
      ),
    },
    {
      key: 'donations',
      header: 'Donations',
      render: (o: Organization) => (
        <span className="font-medium text-sm">{formatCurrency(o.totalDonations)}</span>
      ),
    },
    {
      key: 'matching',
      header: 'Matching',
      hideOnMobile: true,
      render: (o: Organization) => (
        o.matchingGiftProgram ? (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            <Gift className="w-3 h-3 mr-1" />{o.matchRatio}:1
          </Badge>
        ) : <span className="text-xs text-muted">—</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-muted text-sm mt-1">Corporate donors, sponsors, and volunteer groups</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Organization
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Organizations"
          value={mockOrganizations.length}
          subtitle={`${mockOrganizations.filter(o => o.isActive).length} active`}
          icon={<Building2 className="w-5 h-5" />}
          iconColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="Corporate Donations"
          value={formatCurrency(totalCorpDonations)}
          icon={<DollarSign className="w-5 h-5" />}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Corporate Vol. Hours"
          value={`${totalCorpHours}h`}
          icon={<Clock className="w-5 h-5" />}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Matching Programs"
          value={matchingOrgs}
          subtitle="Organizations with gift matching"
          icon={<Gift className="w-5 h-5" />}
          iconColor="bg-warning/10 text-warning"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search by name or contact..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted" />
              <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-44">
                <option value="all">All Types</option>
                <option value="corporation">Corporation</option>
                <option value="foundation">Foundation</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="small-business">Small Business</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(o) => o.id}
          onRowClick={(o) => setSelectedOrg(o)}
        />
      </Card>

      {/* Add Org Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Organization" size="lg">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddModal(false); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Organization Name" required>
              <Input placeholder="Company name" required />
            </FormField>
            <FormField label="Type" required>
              <Select required>
                <option value="">Select type</option>
                <option value="corporation">Corporation</option>
                <option value="foundation">Foundation</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="small-business">Small Business</option>
                <option value="other">Other</option>
              </Select>
            </FormField>
            <FormField label="EIN (Tax ID)">
              <Input placeholder="XX-XXXXXXX" />
            </FormField>
            <FormField label="Primary Contact Name" required>
              <Input placeholder="Contact name" required />
            </FormField>
            <FormField label="Contact Email" required>
              <Input type="email" placeholder="email@company.com" required />
            </FormField>
            <FormField label="Contact Phone" required>
              <Input placeholder="(555) 000-0000" required />
            </FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Address" className="sm:col-span-3">
              <Input placeholder="Street address" />
            </FormField>
            <FormField label="City"><Input placeholder="City" /></FormField>
            <FormField label="State"><Input placeholder="State" /></FormField>
            <FormField label="ZIP"><Input placeholder="ZIP" /></FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Roles">
              <Select>
                <option value="">Select primary role</option>
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
                <option value="sponsor">Sponsor</option>
              </Select>
            </FormField>
            <FormField label="Matching Gift Program">
              <Select>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </Select>
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Add Organization</Button>
          </div>
        </form>
      </Modal>

      {/* Org Detail Modal */}
      <Modal open={!!selectedOrg} onClose={() => setSelectedOrg(null)} title={selectedOrg?.name || ''} size="lg">
        {selectedOrg && (() => {
          const members = mockPeople.filter(p => selectedOrg.memberIds.includes(p.id));
          const orgDonations = mockDonations.filter(d => d.organizationId === selectedOrg.id);
          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge className={getOrgTypeColor(selectedOrg.type)}>{orgTypeLabels[selectedOrg.type]}</Badge>
                    {selectedOrg.roles.map(r => (
                      <Badge key={r} className={getRoleBadgeColor(r)}>{r}</Badge>
                    ))}
                    {selectedOrg.matchingGiftProgram && (
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <Gift className="w-3 h-3 mr-1" />{selectedOrg.matchRatio}:1 Match
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted mt-1">
                    {selectedOrg.ein && <span className="font-mono">EIN: {selectedOrg.ein}</span>}
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selectedOrg.contactEmail}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedOrg.contactPhone}</span>
                  </div>
                  {selectedOrg.city && (
                    <div className="flex items-center gap-1 text-sm text-muted mt-1">
                      <MapPin className="w-3.5 h-3.5" />{selectedOrg.address}, {selectedOrg.city}, {selectedOrg.state} {selectedOrg.zip}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-success/5 border border-success/20 text-center">
                  <p className="text-lg font-bold text-success">{formatCurrency(selectedOrg.totalDonations)}</p>
                  <p className="text-xs text-muted">Total Donated</p>
                </div>
                <div className="p-3 rounded-lg bg-info/5 border border-info/20 text-center">
                  <p className="text-lg font-bold text-info">{selectedOrg.totalVolunteerHours}h</p>
                  <p className="text-xs text-muted">Vol. Hours</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
                  <p className="text-lg font-bold text-primary">{members.length}</p>
                  <p className="text-xs text-muted">People</p>
                </div>
              </div>

              {selectedOrg.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedOrg.tags.map(tag => (
                    <Badge key={tag} className="bg-primary/10 text-primary">{tag}</Badge>
                  ))}
                </div>
              )}

              {/* Associated People */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">Associated People</h3>
                {members.length === 0 ? (
                  <p className="text-sm text-muted py-2">No people linked to this organization yet.</p>
                ) : (
                  <div className="space-y-2">
                    {members.map(m => (
                      <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-medium">
                            {m.firstName[0]}{m.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{m.firstName} {m.lastName}</p>
                            <p className="text-xs text-muted">{m.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {m.roles.map(r => (
                            <Badge key={r} className={getRoleBadgeColor(r)}>{r}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Donation History */}
              {orgDonations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-3">Donation History</h3>
                  <div className="space-y-2">
                    {orgDonations.map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium">{d.description}</p>
                          <p className="text-xs text-muted">{formatDate(d.date)} &middot; {d.category}</p>
                        </div>
                        <span className="font-medium text-sm">
                          {d.type === 'monetary' ? formatCurrency(d.amount || 0) : formatCurrency(d.estimatedValue || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-muted">Organization since {formatDate(selectedOrg.createdAt)}</p>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
