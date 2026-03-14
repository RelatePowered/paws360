'use client';

import { useState } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Clock,
  Heart,
  Download,
  Receipt,
  Building2,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField';
import { DataTable } from '@/components/ui/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { useDonations, mockDonations } from '@/hooks/useTenantData';
import { formatCurrency, formatDate, getDonationTypeColor } from '@/lib/utils';
import type { Donation } from '@/lib/types';

export default function DonationsPage() {
  const allDonations = useDonations(mockDonations);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [donationType, setDonationType] = useState('monetary');

  const filtered = allDonations.filter(d => {
    const matchesSearch = `${d.personName || ''} ${d.organizationName || ''} ${d.description} ${d.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || d.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalMonetary = allDonations.filter(d => d.type === 'monetary').reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalInKind = allDonations.filter(d => d.type === 'in-kind').reduce((sum, d) => sum + (d.estimatedValue || 0), 0);
  const totalHours = allDonations.filter(d => d.type === 'time').reduce((sum, d) => sum + (d.hours || 0), 0);

  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (d: Donation) => <span className="text-sm">{formatDate(d.date)}</span>,
    },
    {
      key: 'donor',
      header: 'Donor',
      render: (d: Donation) => (
        <div>
          <p className="font-medium text-sm">{d.personName || d.organizationName}</p>
          {d.organizationName && d.personName && (
            <p className="text-xs text-muted flex items-center gap-1"><Building2 className="w-3 h-3" />{d.organizationName}</p>
          )}
          {!d.personName && d.organizationName && (
            <p className="text-xs text-muted">{d.category}</p>
          )}
          {d.personName && !d.organizationName && (
            <p className="text-xs text-muted">{d.category}</p>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (d: Donation) => <Badge className={getDonationTypeColor(d.type)}>{d.type}</Badge>,
    },
    {
      key: 'description',
      header: 'Description',
      hideOnMobile: true,
      render: (d: Donation) => (
        <div>
          <p className="text-sm">{d.description}</p>
          {d.itemDescription && <p className="text-xs text-muted">{d.itemDescription}</p>}
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Value',
      render: (d: Donation) => (
        <span className="font-medium text-sm">
          {d.type === 'monetary' ? formatCurrency(d.amount!) :
           d.type === 'time' ? `${d.hours} hours` :
           formatCurrency(d.estimatedValue || 0)}
        </span>
      ),
    },
    {
      key: 'receipt',
      header: 'Receipt',
      hideOnMobile: true,
      render: (d: Donation) => (
        d.receiptIssued ? (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <Receipt className="w-3 h-3 mr-1" />Issued
          </Badge>
        ) : (
          <span className="text-xs text-muted">N/A</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Donations</h1>
          <p className="text-muted text-sm mt-1">Track monetary, in-kind, and time donations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Record Donation
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Monetary Donations"
          value={formatCurrency(totalMonetary)}
          subtitle={`${allDonations.filter(d => d.type === 'monetary').length} donation(s)`}
          icon={<DollarSign className="w-5 h-5" />}
          iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatCard
          title="In-Kind Donations"
          value={formatCurrency(totalInKind)}
          subtitle={`${allDonations.filter(d => d.type === 'in-kind').length} donation(s)`}
          icon={<Heart className="w-5 h-5" />}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <StatCard
          title="Volunteer Time"
          value={`${totalHours} hours`}
          subtitle={`${allDonations.filter(d => d.type === 'time').length} entry(ies)`}
          icon={<Clock className="w-5 h-5" />}
          iconColor="bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search by donor, description, or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted" />
              <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-40">
                <option value="all">All Types</option>
                <option value="monetary">Monetary</option>
                <option value="in-kind">In-Kind</option>
                <option value="time">Time</option>
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
          keyExtractor={(d) => d.id}
        />
      </Card>

      {/* Add Donation Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Record Donation" size="lg">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddModal(false); }}>
          <FormField label="Donation Type" required>
            <div className="flex gap-2">
              {(['monetary', 'in-kind', 'time'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDonationType(type)}
                  className={`flex-1 p-3 rounded-lg border text-center text-sm font-medium transition-colors ${
                    donationType === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-surface hover:bg-surface-hover'
                  }`}
                >
                  {type === 'monetary' && <DollarSign className="w-4 h-4 mx-auto mb-1" />}
                  {type === 'in-kind' && <Heart className="w-4 h-4 mx-auto mb-1" />}
                  {type === 'time' && <Clock className="w-4 h-4 mx-auto mb-1" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Donor" required>
              <Input placeholder="Search donor by name..." required />
            </FormField>
            <FormField label="Date" required>
              <Input type="date" required />
            </FormField>
            <FormField label="Category" required>
              <Select required>
                <option value="">Select category</option>
                <option value="General Fund">General Fund</option>
                <option value="Capital Campaign">Capital Campaign</option>
                <option value="Supplies">Supplies</option>
                <option value="Events">Events</option>
                <option value="Animal Care">Animal Care</option>
                <option value="Administration">Administration</option>
                <option value="Medical">Medical</option>
              </Select>
            </FormField>

            {donationType === 'monetary' && (
              <FormField label="Amount ($)" required>
                <Input type="number" step="0.01" placeholder="0.00" required />
              </FormField>
            )}
            {donationType === 'in-kind' && (
              <>
                <FormField label="Estimated Value ($)">
                  <Input type="number" step="0.01" placeholder="0.00" />
                </FormField>
                <FormField label="Item Description" required className="sm:col-span-2">
                  <Input placeholder="What was donated?" required />
                </FormField>
              </>
            )}
            {donationType === 'time' && (
              <FormField label="Hours" required>
                <Input type="number" step="0.5" placeholder="0" required />
              </FormField>
            )}
          </div>

          <FormField label="Description" required>
            <Textarea placeholder="Brief description of the donation..." rows={2} required />
          </FormField>

          {donationType !== 'time' && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-border" />
              Issue tax receipt
            </label>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Record Donation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
