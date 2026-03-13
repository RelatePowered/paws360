'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  ArrowLeftRight,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { mockPeople } from '@/lib/mock-data';
import { formatCurrency, formatDate, getRoleBadgeColor } from '@/lib/utils';
import type { Person, PersonRole } from '@/lib/types';

export default function PeoplePage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [transitionPerson, setTransitionPerson] = useState<Person | null>(null);

  const filtered = mockPeople.filter(p => {
    const matchesSearch = `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (p: Person) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-medium shrink-0">
            {p.firstName[0]}{p.lastName[0]}
          </div>
          <div>
            <p className="font-medium">{p.firstName} {p.lastName}</p>
            <p className="text-xs text-muted">{p.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (p: Person) => (
        <div className="flex items-center gap-2">
          <Badge className={getRoleBadgeColor(p.role)}>{p.role}</Badge>
          {p.roleHistory.length > 0 && (
            <span title="Has role transitions" className="text-primary">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      hideOnMobile: true,
      render: (p: Person) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-muted"><Phone className="w-3 h-3" />{p.phone}</div>
        </div>
      ),
    },
    {
      key: 'donations',
      header: 'Donations',
      hideOnMobile: true,
      render: (p: Person) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-success" />
          <span>{formatCurrency(p.totalDonations)}</span>
        </div>
      ),
    },
    {
      key: 'hours',
      header: 'Hours',
      hideOnMobile: true,
      render: (p: Person) => (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-info" />
          <span>{p.totalVolunteerHours}h</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p: Person) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setTransitionPerson(p);
            setShowTransitionModal(true);
          }}
          title="Change role"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">People</h1>
          <p className="text-muted text-sm mt-1">Manage donors and volunteers</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Person
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted" />
              <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="w-40">
                <option value="all">All Roles</option>
                <option value="donor">Donors</option>
                <option value="volunteer">Volunteers</option>
                <option value="both">Both</option>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary">{mockPeople.filter(p => p.role === 'donor' || p.role === 'both').length}</p>
          <p className="text-sm text-muted">Donors</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-success">{mockPeople.filter(p => p.role === 'volunteer' || p.role === 'both').length}</p>
          <p className="text-sm text-muted">Volunteers</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-secondary">{mockPeople.filter(p => p.role === 'both').length}</p>
          <p className="text-sm text-muted">Dual Role</p>
        </div>
      </div>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          onRowClick={(p) => setSelectedPerson(p)}
        />
      </Card>

      {/* Add Person Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Person" size="lg">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddModal(false); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <Input placeholder="First name" required />
            </FormField>
            <FormField label="Last Name" required>
              <Input placeholder="Last name" required />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" placeholder="email@example.com" required />
            </FormField>
            <FormField label="Phone" required>
              <Input placeholder="(555) 000-0000" required />
            </FormField>
            <FormField label="Role" required>
              <Select required>
                <option value="">Select role</option>
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
                <option value="both">Both</option>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Address" className="sm:col-span-3">
              <Input placeholder="Street address" />
            </FormField>
            <FormField label="City">
              <Input placeholder="City" />
            </FormField>
            <FormField label="State">
              <Input placeholder="State" />
            </FormField>
            <FormField label="ZIP">
              <Input placeholder="ZIP" />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Add Person</Button>
          </div>
        </form>
      </Modal>

      {/* Person Detail Modal */}
      <Modal open={!!selectedPerson} onClose={() => setSelectedPerson(null)} title={selectedPerson ? `${selectedPerson.firstName} ${selectedPerson.lastName}` : ''} size="lg">
        {selectedPerson && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-medium">
                {selectedPerson.firstName[0]}{selectedPerson.lastName[0]}
              </div>
              <div>
                <Badge className={getRoleBadgeColor(selectedPerson.role)}>{selectedPerson.role}</Badge>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selectedPerson.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedPerson.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-success/5 border border-success/20 text-center">
                <p className="text-xl font-bold text-success">{formatCurrency(selectedPerson.totalDonations)}</p>
                <p className="text-sm text-muted">Total Donations</p>
              </div>
              <div className="p-4 rounded-lg bg-info/5 border border-info/20 text-center">
                <p className="text-xl font-bold text-info">{selectedPerson.totalVolunteerHours}h</p>
                <p className="text-sm text-muted">Volunteer Hours</p>
              </div>
            </div>

            {selectedPerson.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPerson.tags.map(tag => (
                    <Badge key={tag} className="bg-primary/10 text-primary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedPerson.roleHistory.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Role History</h3>
                <div className="space-y-2">
                  {selectedPerson.roleHistory.map(t => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <ArrowLeftRight className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className={getRoleBadgeColor(t.fromRole)}>{t.fromRole}</Badge>
                          <span className="text-muted">&rarr;</span>
                          <Badge className={getRoleBadgeColor(t.toRole)}>{t.toRole}</Badge>
                        </div>
                        {t.note && <p className="text-xs text-muted mt-1">{t.note}</p>}
                      </div>
                      <span className="text-xs text-muted">{formatDate(t.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted">Member since {formatDate(selectedPerson.createdAt)}</p>
          </div>
        )}
      </Modal>

      {/* Role Transition Modal */}
      <Modal open={showTransitionModal} onClose={() => { setShowTransitionModal(false); setTransitionPerson(null); }} title="Change Role" size="sm">
        {transitionPerson && (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowTransitionModal(false); setTransitionPerson(null); }}>
            <p className="text-sm">
              Change role for <strong>{transitionPerson.firstName} {transitionPerson.lastName}</strong>
            </p>
            <div className="flex items-center gap-3">
              <Badge className={getRoleBadgeColor(transitionPerson.role)}>{transitionPerson.role}</Badge>
              <ArrowLeftRight className="w-4 h-4 text-muted" />
              <FormField label="">
                <Select required>
                  <option value="">New role</option>
                  {(['donor', 'volunteer', 'both'] as PersonRole[])
                    .filter(r => r !== transitionPerson.role)
                    .map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </Select>
              </FormField>
            </div>
            <FormField label="Reason for transition">
              <Select required>
                <option value="">Select reason</option>
                <option value="started-volunteering">Started volunteering</option>
                <option value="started-donating">Started donating</option>
                <option value="focus-volunteer">Focusing on volunteer work</option>
                <option value="focus-donor">Focusing on donations</option>
                <option value="dual-role">Taking on dual role</option>
              </Select>
            </FormField>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" type="button" onClick={() => { setShowTransitionModal(false); setTransitionPerson(null); }}>Cancel</Button>
              <Button type="submit">Save Transition</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
