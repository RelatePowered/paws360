'use client';

import { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  DollarSign,
  Users,
  PawPrint,
  Clock,
  Heart,
  ArrowLeftRight,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField, Select, Input } from '@/components/ui/FormField';
import { mockPeople, mockAnimals, mockDonations, mockAdoptions } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

type ReportType = 'donations' | 'volunteers' | 'animals' | 'adoptions' | 'people';

const reportConfigs: Record<ReportType, { title: string; description: string; icon: React.ReactNode; color: string }> = {
  donations: {
    title: 'Donation Report',
    description: 'Summary of all monetary, in-kind, and time donations',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  volunteers: {
    title: 'Volunteer Hours Report',
    description: 'Track volunteer time contributions',
    icon: <Clock className="w-5 h-5" />,
    color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  },
  animals: {
    title: 'Animal Census Report',
    description: 'Current animal inventory by status and species',
    icon: <PawPrint className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  adoptions: {
    title: 'Adoption Report',
    description: 'Adoption records including returns and fees',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  },
  people: {
    title: 'People & Role Transitions',
    description: 'Donor/volunteer roster and role change history',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-primary/10 text-primary',
  },
};

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  const totalMonetary = mockDonations.filter(d => d.type === 'monetary').reduce((s, d) => s + (d.amount || 0), 0);
  const totalInKind = mockDonations.filter(d => d.type === 'in-kind').reduce((s, d) => s + (d.estimatedValue || 0), 0);
  const totalHours = mockDonations.filter(d => d.type === 'time').reduce((s, d) => s + (d.hours || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted text-sm mt-1">Generate and export reports</p>
        </div>
      </div>

      {/* Export Options Banner */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-muted" />
                Export Data
              </h3>
              <p className="text-sm text-muted mt-1">Export data for QuickBooks, charity trackers, or custom reporting</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                QuickBooks Format
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Date Range Filter */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <FormField label="Date Range" className="flex-1">
              <div className="flex gap-2 items-center">
                <Input type="date" />
                <span className="text-muted text-sm">to</span>
                <Input type="date" />
              </div>
            </FormField>
            <Button variant="outline">Apply Filter</Button>
          </div>
        </CardBody>
      </Card>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.entries(reportConfigs) as [ReportType, typeof reportConfigs[ReportType]][]).map(([key, config]) => (
          <Card
            key={key}
            onClick={() => setSelectedReport(selectedReport === key ? null : key)}
            className={selectedReport === key ? 'ring-2 ring-primary' : ''}
          >
            <CardBody>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                  {config.icon}
                </div>
                <div>
                  <h3 className="font-medium">{config.title}</h3>
                  <p className="text-xs text-muted mt-1">{config.description}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Report Preview */}
      {selectedReport === 'donations' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Donation Summary</h3>
              <Button variant="outline" size="sm"><Download className="w-4 h-4" />Export</Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalMonetary)}</p>
                <p className="text-sm text-muted">Monetary</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalInKind)}</p>
                <p className="text-sm text-muted">In-Kind Value</p>
              </div>
              <div className="p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-center">
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{totalHours}h</p>
                <p className="text-sm text-muted">Volunteer Time</p>
              </div>
            </div>
            <h4 className="text-sm font-medium mb-3">By Category</h4>
            <div className="space-y-2">
              {['General Fund', 'Capital Campaign', 'Supplies', 'Events', 'Animal Care', 'Administration'].map(cat => {
                const catDonations = mockDonations.filter(d => d.category === cat);
                const catTotal = catDonations.reduce((s, d) => s + (d.amount || d.estimatedValue || 0), 0);
                if (catDonations.length === 0) return null;
                return (
                  <div key={cat} className="flex items-center justify-between py-2">
                    <span className="text-sm">{cat}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">{catDonations.length} donation(s)</span>
                      <span className="font-medium text-sm">{formatCurrency(catTotal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {selectedReport === 'animals' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Animal Census</h3>
              <Button variant="outline" size="sm"><Download className="w-4 h-4" />Export</Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {['available', 'adopted', 'foster', 'medical-hold'].map(status => (
                <div key={status} className="p-4 rounded-lg bg-surface-hover text-center">
                  <p className="text-2xl font-bold">{mockAnimals.filter(a => a.status === status).length}</p>
                  <p className="text-sm text-muted capitalize">{status.replace('-', ' ')}</p>
                </div>
              ))}
            </div>
            <h4 className="text-sm font-medium mb-3">By Species</h4>
            <div className="space-y-2">
              {['dog', 'cat', 'bird', 'rabbit', 'other'].map(species => {
                const count = mockAnimals.filter(a => a.species === species).length;
                if (count === 0) return null;
                return (
                  <div key={species} className="flex items-center justify-between py-2">
                    <span className="text-sm capitalize">{species}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {selectedReport === 'people' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">People & Role Transitions</h3>
              <Button variant="outline" size="sm"><Download className="w-4 h-4" />Export</Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {mockPeople.filter(p => p.role === 'donor' || p.role === 'both').length}
                </p>
                <p className="text-sm text-muted">Donors</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mockPeople.filter(p => p.role === 'volunteer' || p.role === 'both').length}
                </p>
                <p className="text-sm text-muted">Volunteers</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {mockPeople.filter(p => p.roleHistory.length > 0).length}
                </p>
                <p className="text-sm text-muted">Role Transitions</p>
              </div>
            </div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4" />
              Transition History
            </h4>
            <div className="space-y-2">
              {mockPeople.filter(p => p.roleHistory.length > 0).map(p => (
                p.roleHistory.map(t => (
                  <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/5">
                    <span className="text-sm font-medium">{p.firstName} {p.lastName}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">{t.fromRole}</Badge>
                      <span>&rarr;</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">{t.toRole}</Badge>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {selectedReport === 'volunteers' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Volunteer Hours Summary</h3>
              <Button variant="outline" size="sm"><Download className="w-4 h-4" />Export</Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-center mb-6">
              <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">{totalHours}h</p>
              <p className="text-sm text-muted">Total Volunteer Hours</p>
            </div>
            <h4 className="text-sm font-medium mb-3">By Volunteer</h4>
            <div className="space-y-2">
              {mockPeople.filter(p => p.totalVolunteerHours > 0).sort((a, b) => b.totalVolunteerHours - a.totalVolunteerHours).map(p => (
                <div key={p.id} className="flex items-center justify-between py-2">
                  <span className="text-sm">{p.firstName} {p.lastName}</span>
                  <span className="font-medium">{p.totalVolunteerHours}h</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {selectedReport === 'adoptions' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Adoption Summary</h3>
              <Button variant="outline" size="sm"><Download className="w-4 h-4" />Export</Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mockAdoptions.filter(a => a.status === 'completed').length}
                </p>
                <p className="text-sm text-muted">Completed</p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {mockAdoptions.filter(a => a.status === 'returned').length}
                </p>
                <p className="text-sm text-muted">Returned</p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(mockAdoptions.reduce((s, a) => s + a.fee, 0))}
                </p>
                <p className="text-sm text-muted">Total Fees</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
