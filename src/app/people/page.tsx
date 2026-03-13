'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Filter,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  CircleDot,
  MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { mockPeople, mockDonations } from '@/lib/mock-data';
import { formatCurrency, formatDate, getRoleBadgeColor, getMoveInsight } from '@/lib/utils';
import type { Person, Move } from '@/lib/types';

function MovesTimeline({ person }: { person: Person }) {
  const moves = [...person.moves].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const personDonations = mockDonations.filter(d => d.personId === person.id);

  if (moves.length === 0) {
    return (
      <div className="text-center py-6 text-muted">
        <CircleDot className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No moves recorded yet</p>
        <p className="text-xs mt-1">This person joined as: {person.roles.join(', ')}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[17px] top-3 bottom-3 w-px bg-border" />

      <div className="space-y-0">
        {moves.map((move, idx) => {
          const insight = getMoveInsight(move);
          const isFirst = idx === 0;
          const isLast = idx === moves.length - 1;
          const added = move.toRoles.filter(r => !move.fromRoles.includes(r));
          const removed = move.fromRoles.filter(r => !move.toRoles.includes(r));

          const sentimentIcon = insight.sentiment === 'positive'
            ? <TrendingUp className="w-3.5 h-3.5" />
            : insight.sentiment === 'negative'
            ? <TrendingDown className="w-3.5 h-3.5" />
            : <Minus className="w-3.5 h-3.5" />;

          const sentimentColor = insight.sentiment === 'positive'
            ? 'text-success bg-success/10 border-success/20'
            : insight.sentiment === 'negative'
            ? 'text-warning bg-warning/10 border-warning/20'
            : 'text-muted bg-surface-hover border-border';

          const dotColor = insight.sentiment === 'positive'
            ? 'bg-success border-success/30'
            : insight.sentiment === 'negative'
            ? 'bg-warning border-warning/30'
            : 'bg-muted border-border';

          return (
            <div key={move.id} className="relative pl-10 pb-6 last:pb-0">
              {/* Timeline dot */}
              <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 ${dotColor}`} />

              {/* Date */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-muted">{formatDate(move.date)}</span>
                {isFirst && (
                  <Badge className="bg-primary/10 text-primary text-xs">First contact</Badge>
                )}
                {isLast && !isFirst && (
                  <Badge className="bg-primary/10 text-primary text-xs">Latest</Badge>
                )}
              </div>

              {/* Role change badges */}
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                {move.fromRoles.length > 0 && (
                  <>
                    {move.fromRoles.map(r => (
                      <Badge key={`from-${r}`} className={`${getRoleBadgeColor(r)} ${removed.includes(r) ? 'opacity-50 line-through' : ''}`}>
                        {r}
                      </Badge>
                    ))}
                    <span className="text-muted text-xs">&rarr;</span>
                  </>
                )}
                {move.toRoles.map(r => (
                  <Badge key={`to-${r}`} className={`${getRoleBadgeColor(r)} ${added.includes(r) ? 'ring-2 ring-offset-1 ring-primary/30' : ''}`}>
                    {r}
                    {added.includes(r) && <Sparkles className="w-2.5 h-2.5 ml-0.5 inline" />}
                  </Badge>
                ))}
              </div>

              {/* Trigger */}
              {move.trigger && (
                <p className="text-sm mb-2">{move.trigger}</p>
              )}

              {/* Contextual insight */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${sentimentColor}`}>
                {sentimentIcon}
                {insight.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Engagement summary after timeline */}
      {moves.length >= 2 && (
        <div className="mt-6 p-4 rounded-lg bg-surface-hover border border-border">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Engagement Summary</h4>
          <div className="space-y-1.5 text-sm">
            <p>
              <span className="font-medium">{person.firstName}</span> has been with the shelter for{' '}
              <span className="font-medium">
                {Math.round((new Date().getTime() - new Date(person.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
              </span>
              {' '}and has gone through <span className="font-medium">{moves.length - 1} move{moves.length - 1 !== 1 ? 's' : ''}</span> since initial contact.
            </p>
            {person.roles.length >= 2 && (
              <p className="text-success">
                Currently active in {person.roles.length} roles — a highly engaged community member.
              </p>
            )}
            {person.roles.length === 1 && person.moves.length > 2 && (
              <p className="text-warning">
                Previously more engaged. Consider outreach to explore re-engagement.
              </p>
            )}
            {person.totalDonations > 0 && person.totalVolunteerHours > 0 && (
              <p className="text-muted">
                Lifetime: {formatCurrency(person.totalDonations)} donated + {person.totalVolunteerHours}h volunteered
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PeoplePage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filtered = mockPeople.filter(p => {
    const matchesSearch = `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || p.roles.includes(roleFilter);
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
      key: 'roles',
      header: 'Roles',
      render: (p: Person) => (
        <div className="flex items-center gap-1 flex-wrap">
          {p.roles.map(r => (
            <Badge key={r} className={getRoleBadgeColor(r)}>{r}</Badge>
          ))}
          {p.moves.length > 1 && (
            <span className="text-xs text-muted ml-1" title={`${p.moves.length - 1} move(s)`}>
              &middot; {p.moves.length - 1} move{p.moves.length - 1 !== 1 ? 's' : ''}
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
        <div className="flex items-center gap-1 text-muted">
          <Phone className="w-3 h-3" />{p.phone}
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">People</h1>
          <p className="text-muted text-sm mt-1">Manage donors, volunteers, and adopters</p>
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
                <option value="adopter">Adopters</option>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary">{mockPeople.filter(p => p.roles.includes('donor')).length}</p>
          <p className="text-sm text-muted">Donors</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-success">{mockPeople.filter(p => p.roles.includes('volunteer')).length}</p>
          <p className="text-sm text-muted">Volunteers</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-secondary">{mockPeople.filter(p => p.roles.includes('adopter')).length}</p>
          <p className="text-sm text-muted">Adopters</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-warning">{mockPeople.filter(p => p.roles.length >= 2).length}</p>
          <p className="text-sm text-muted">Multi-role</p>
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
            <FormField label="Initial Role" required>
              <Select required>
                <option value="">Select role</option>
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
                <option value="adopter">Adopter</option>
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
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-medium shrink-0">
                {selectedPerson.firstName[0]}{selectedPerson.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {selectedPerson.roles.map(r => (
                    <Badge key={r} className={getRoleBadgeColor(r)}>{r}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selectedPerson.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedPerson.phone}</span>
                  {selectedPerson.city && (
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedPerson.city}, {selectedPerson.state}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-success/5 border border-success/20 text-center">
                <p className="text-lg font-bold text-success">{formatCurrency(selectedPerson.totalDonations)}</p>
                <p className="text-xs text-muted">Donated</p>
              </div>
              <div className="p-3 rounded-lg bg-info/5 border border-info/20 text-center">
                <p className="text-lg font-bold text-info">{selectedPerson.totalVolunteerHours}h</p>
                <p className="text-xs text-muted">Volunteered</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
                <p className="text-lg font-bold text-primary">{selectedPerson.moves.length - 1}</p>
                <p className="text-xs text-muted">Move{selectedPerson.moves.length - 1 !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {selectedPerson.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPerson.tags.map(tag => (
                  <Badge key={tag} className="bg-primary/10 text-primary">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Moves Management Timeline */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">Moves Management</h3>
              <MovesTimeline person={selectedPerson} />
            </div>

            <p className="text-xs text-muted">Member since {formatDate(selectedPerson.createdAt)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
