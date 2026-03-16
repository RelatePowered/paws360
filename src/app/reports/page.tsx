'use client';

import { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Users,
  PawPrint,
  Clock,
  Heart,
  ArrowLeftRight,
  Calendar,
  Building2,
  Mail,
  Printer,
  CheckCircle2,
  Shield,
  Activity,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField, Select, Input } from '@/components/ui/FormField';
import { usePeople, useAnimals, useDonations, useAdoptions, mockPeople, mockAnimals, mockDonations, mockAdoptions } from '@/hooks/useTenantData';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { TaxLetterRecord, Animal, AsilomarStats, SacReportRow, AnimalSpecies } from '@/lib/types';

type ReportType = 'donations' | 'volunteers' | 'animals' | 'adoptions' | 'people' | 'tax-letters' | 'asilomar' | 'sac';

function computeAsilomarStats(animals: Animal[]): AsilomarStats {
  const withOutcome = animals.filter(a => a.outcomeType);

  const healthyIntake = animals.filter(a => a.intakeCondition === 'healthy').length;
  const treatableRehabIntake = animals.filter(a => a.intakeCondition === 'treatable-rehabilitable').length;
  const treatableManageIntake = animals.filter(a => a.intakeCondition === 'treatable-manageable').length;
  const unhealthyIntake = animals.filter(a => a.intakeCondition === 'unhealthy-untreatable').length;
  const totalIntake = animals.length;

  const liveOutcomeTypes = ['adoption', 'return-to-owner', 'transfer-out'];
  const liveOutcomes = withOutcome.filter(a => liveOutcomeTypes.includes(a.outcomeType!)).length;
  const totalOutcomes = withOutcome.length;

  // Asilomar LRR formula: Live Outcomes / (Total Outcomes - Owner-Requested Euthanasia of Unhealthy/Untreatable)
  const ownerRequestEuthanasiaUnhealthy = withOutcome.filter(
    a => a.outcomeType === 'euthanasia-owner-request' && a.intakeCondition === 'unhealthy-untreatable'
  ).length;
  const adjustedOutcomes = totalOutcomes - ownerRequestEuthanasiaUnhealthy;
  const liveReleaseRate = adjustedOutcomes > 0 ? Math.round((liveOutcomes / adjustedOutcomes) * 1000) / 10 : 0;
  const saveRate = totalOutcomes > 0 ? Math.round(((totalOutcomes - withOutcome.filter(a => a.outcomeType === 'euthanasia-shelter' || a.outcomeType === 'euthanasia-owner-request').length) / totalOutcomes) * 1000) / 10 : 0;

  return {
    healthyIntake,
    treatableRehabIntake,
    treatableManageIntake,
    unhealthyIntake,
    totalIntake,
    liveOutcomes,
    totalOutcomes,
    ownerRequestEuthanasiaUnhealthy,
    liveReleaseRate,
    saveRate,
  };
}

function computeSacReport(animals: Animal[]): SacReportRow[] {
  const species: AnimalSpecies[] = ['dog', 'cat', 'bird', 'rabbit', 'other'];

  return species.map(sp => {
    const spAnimals = animals.filter(a => a.species === sp);
    const withOutcome = spAnimals.filter(a => a.outcomeType);

    return {
      species: sp,
      intakeStray: spAnimals.filter(a => a.intakeType === 'stray').length,
      intakeSurrender: spAnimals.filter(a => a.intakeType === 'surrender').length,
      intakeTransfer: spAnimals.filter(a => a.intakeType === 'transfer').length,
      intakeOther: spAnimals.filter(a => ['return', 'confiscation'].includes(a.intakeType)).length,
      intakeTotal: spAnimals.length,
      outcomeAdoption: withOutcome.filter(a => a.outcomeType === 'adoption').length,
      outcomeReturnToOwner: withOutcome.filter(a => a.outcomeType === 'return-to-owner').length,
      outcomeTransferOut: withOutcome.filter(a => a.outcomeType === 'transfer-out').length,
      outcomeEuthanasia: withOutcome.filter(a => a.outcomeType === 'euthanasia-shelter' || a.outcomeType === 'euthanasia-owner-request').length,
      outcomeDiedInCare: withOutcome.filter(a => a.outcomeType === 'died-in-care').length,
      outcomeOther: withOutcome.filter(a => a.outcomeType === 'missing' || a.outcomeType === 'other').length,
      outcomeTotal: withOutcome.length,
    };
  }).filter(row => row.intakeTotal > 0 || row.outcomeTotal > 0);
}

function generateSacCsv(rows: SacReportRow[]): string {
  const headers = ['Species', 'Intake: Stray', 'Intake: Surrender', 'Intake: Transfer', 'Intake: Other', 'Intake: Total', 'Outcome: Adoption', 'Outcome: RTO', 'Outcome: Transfer Out', 'Outcome: Euthanasia', 'Outcome: Died in Care', 'Outcome: Other', 'Outcome: Total'];
  const csvRows = rows.map(r => [
    r.species, r.intakeStray, r.intakeSurrender, r.intakeTransfer, r.intakeOther, r.intakeTotal,
    r.outcomeAdoption, r.outcomeReturnToOwner, r.outcomeTransferOut, r.outcomeEuthanasia, r.outcomeDiedInCare, r.outcomeOther, r.outcomeTotal,
  ].join(','));
  return [headers.join(','), ...csvRows].join('\n');
}

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
  'tax-letters': {
    title: 'Tax Letters',
    description: 'Generate annual tax acknowledgment letters',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  asilomar: {
    title: 'Asilomar / Live Release Rate',
    description: 'Asilomar Accords statistics and live release rate calculation',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  },
  sac: {
    title: 'Shelter Animals Count (SAC)',
    description: 'Monthly intake/outcome data for SAC/ASPCA submission',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
};

export default function ReportsPage() {
  const allPeople = usePeople(mockPeople);
  const allAnimals = useAnimals(mockAnimals);
  const allDonations = useDonations(mockDonations);
  const allAdoptions = useAdoptions(mockAdoptions);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  const totalMonetary = allDonations.filter(d => d.type === 'monetary').reduce((s, d) => s + (d.amount || 0), 0);
  const totalInKind = allDonations.filter(d => d.type === 'in-kind').reduce((s, d) => s + (d.estimatedValue || 0), 0);
  const totalHours = allDonations.filter(d => d.type === 'time').reduce((s, d) => s + (d.hours || 0), 0);

  const asilomarStats = computeAsilomarStats(allAnimals);
  const sacReport = computeSacReport(allAnimals);

  const handleSacExport = () => {
    const csv = generateSacCsv(sacReport);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sac-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                const catDonations = allDonations.filter(d => d.category === cat);
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
                  <p className="text-2xl font-bold">{allAnimals.filter(a => a.status === status).length}</p>
                  <p className="text-sm text-muted capitalize">{status.replace('-', ' ')}</p>
                </div>
              ))}
            </div>
            <h4 className="text-sm font-medium mb-3">By Species</h4>
            <div className="space-y-2">
              {['dog', 'cat', 'bird', 'rabbit', 'other'].map(species => {
                const count = allAnimals.filter(a => a.species === species).length;
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
              <h3 className="font-semibold">People & Moves Management</h3>
              <Button variant="outline" size="sm"><Download className="w-4 h-4" />Export</Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {allPeople.filter(p => p.roles.includes('donor')).length}
                </p>
                <p className="text-sm text-muted">Donors</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {allPeople.filter(p => p.roles.includes('volunteer')).length}
                </p>
                <p className="text-sm text-muted">Volunteers</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {allPeople.filter(p => p.roles.includes('adopter')).length}
                </p>
                <p className="text-sm text-muted">Adopters</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {allPeople.reduce((sum, p) => sum + Math.max(0, p.moves.length - 1), 0)}
                </p>
                <p className="text-sm text-muted">Total Moves</p>
              </div>
            </div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4" />
              Move History
            </h4>
            <div className="space-y-2">
              {allPeople.filter(p => p.moves.length > 1).map(p => (
                p.moves.slice(1).map(m => {
                  const added = m.toRoles.filter(r => !m.fromRoles.includes(r));
                  const removed = m.fromRoles.filter(r => !m.toRoles.includes(r));
                  return (
                    <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/5">
                      <div>
                        <span className="text-sm font-medium">{p.firstName} {p.lastName}</span>
                        <span className="text-xs text-muted ml-2">{formatDate(m.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        {added.map(r => (
                          <Badge key={r} className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">+{r}</Badge>
                        ))}
                        {removed.map(r => (
                          <Badge key={r} className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">-{r}</Badge>
                        ))}
                      </div>
                    </div>
                  );
                })
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
              {allPeople.filter(p => p.totalVolunteerHours > 0).sort((a, b) => b.totalVolunteerHours - a.totalVolunteerHours).map(p => (
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
                  {allAdoptions.filter(a => a.status === 'completed').length}
                </p>
                <p className="text-sm text-muted">Completed</p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {allAdoptions.filter(a => a.status === 'returned').length}
                </p>
                <p className="text-sm text-muted">Returned</p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(allAdoptions.reduce((s, a) => s + a.fee, 0))}
                </p>
                <p className="text-sm text-muted">Total Fees</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Asilomar / Live Release Rate Report */}
      {selectedReport === 'asilomar' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Asilomar Accords Statistics
              </h3>
              <Button variant="outline" size="sm"><Download className="w-4 h-4" />Export</Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg text-center ${
                asilomarStats.liveReleaseRate >= 90
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : asilomarStats.liveReleaseRate >= 70
                  ? 'bg-yellow-50 dark:bg-yellow-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                <p className={`text-3xl font-bold ${
                  asilomarStats.liveReleaseRate >= 90
                    ? 'text-green-600 dark:text-green-400'
                    : asilomarStats.liveReleaseRate >= 70
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {asilomarStats.liveReleaseRate}%
                </p>
                <p className="text-sm text-muted">Live Release Rate</p>
                {asilomarStats.liveReleaseRate >= 90 && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mt-1">No-Kill Benchmark Met</Badge>
                )}
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{asilomarStats.saveRate}%</p>
                <p className="text-sm text-muted">Save Rate</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {asilomarStats.liveOutcomes}/{asilomarStats.totalOutcomes}
                </p>
                <p className="text-sm text-muted">Live / Total Outcomes</p>
              </div>
            </div>

            {/* Intake by Condition */}
            <h4 className="text-sm font-medium mb-3">Intake by Asilomar Condition</h4>
            <div className="space-y-2 mb-6">
              {[
                { label: 'Healthy', count: asilomarStats.healthyIntake, color: 'bg-green-500' },
                { label: 'Treatable - Rehabilitable', count: asilomarStats.treatableRehabIntake, color: 'bg-blue-500' },
                { label: 'Treatable - Manageable', count: asilomarStats.treatableManageIntake, color: 'bg-yellow-500' },
                { label: 'Unhealthy / Untreatable', count: asilomarStats.unhealthyIntake, color: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-32 text-sm">{item.label}</div>
                  <div className="flex-1 bg-surface-hover rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full flex items-center justify-end pr-2`}
                      style={{ width: asilomarStats.totalIntake > 0 ? `${Math.max((item.count / asilomarStats.totalIntake) * 100, 8)}%` : '0%' }}
                    >
                      <span className="text-xs text-white font-medium">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LRR Formula */}
            <div className="p-4 rounded-lg bg-surface-hover text-sm space-y-2">
              <h4 className="font-medium">Live Release Rate Formula (Asilomar)</h4>
              <p className="text-muted">
                LRR = Live Outcomes / (Total Outcomes - Owner-Requested Euthanasia of Unhealthy/Untreatable)
              </p>
              <p className="font-mono text-xs">
                = {asilomarStats.liveOutcomes} / ({asilomarStats.totalOutcomes} - {asilomarStats.ownerRequestEuthanasiaUnhealthy}) = {asilomarStats.liveReleaseRate}%
              </p>
              <p className="text-xs text-muted mt-2">
                No-kill benchmark: 90% or higher live release rate
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* SAC Report */}
      {selectedReport === 'sac' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Shelter Animals Count (SAC) Report
              </h3>
              <Button variant="outline" size="sm" onClick={handleSacExport}>
                <Download className="w-4 h-4" />
                Export SAC CSV
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted mb-4">
              Monthly aggregated intake and outcome counts formatted for Shelter Animals Count (ASPCA) submission.
              Organizations reporting to SAC qualify for grants from national animal welfare foundations.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-medium">Species</th>
                    <th className="text-right py-2 px-2 font-medium text-orange-600 dark:text-orange-400" colSpan={5}>Intake</th>
                    <th className="text-right py-2 px-2 font-medium text-blue-600 dark:text-blue-400" colSpan={7}>Outcomes</th>
                  </tr>
                  <tr className="border-b border-border text-xs text-muted">
                    <th className="text-left py-1 px-2"></th>
                    <th className="text-right py-1 px-2">Stray</th>
                    <th className="text-right py-1 px-2">Surrender</th>
                    <th className="text-right py-1 px-2">Transfer</th>
                    <th className="text-right py-1 px-2">Other</th>
                    <th className="text-right py-1 px-2 font-bold">Total</th>
                    <th className="text-right py-1 px-2">Adoption</th>
                    <th className="text-right py-1 px-2">RTO</th>
                    <th className="text-right py-1 px-2">Transfer</th>
                    <th className="text-right py-1 px-2">Euth.</th>
                    <th className="text-right py-1 px-2">Died</th>
                    <th className="text-right py-1 px-2">Other</th>
                    <th className="text-right py-1 px-2 font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sacReport.map(row => (
                    <tr key={row.species} className="border-b border-border hover:bg-surface-hover">
                      <td className="py-2 px-2 capitalize font-medium">{row.species}</td>
                      <td className="text-right py-2 px-2">{row.intakeStray}</td>
                      <td className="text-right py-2 px-2">{row.intakeSurrender}</td>
                      <td className="text-right py-2 px-2">{row.intakeTransfer}</td>
                      <td className="text-right py-2 px-2">{row.intakeOther}</td>
                      <td className="text-right py-2 px-2 font-bold">{row.intakeTotal}</td>
                      <td className="text-right py-2 px-2">{row.outcomeAdoption}</td>
                      <td className="text-right py-2 px-2">{row.outcomeReturnToOwner}</td>
                      <td className="text-right py-2 px-2">{row.outcomeTransferOut}</td>
                      <td className="text-right py-2 px-2">{row.outcomeEuthanasia}</td>
                      <td className="text-right py-2 px-2">{row.outcomeDiedInCare}</td>
                      <td className="text-right py-2 px-2">{row.outcomeOther}</td>
                      <td className="text-right py-2 px-2 font-bold">{row.outcomeTotal}</td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr className="bg-surface-hover font-bold">
                    <td className="py-2 px-2">Total</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.intakeStray, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.intakeSurrender, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.intakeTransfer, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.intakeOther, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.intakeTotal, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.outcomeAdoption, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.outcomeReturnToOwner, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.outcomeTransferOut, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.outcomeEuthanasia, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.outcomeDiedInCare, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.outcomeOther, 0)}</td>
                    <td className="text-right py-2 px-2">{sacReport.reduce((s, r) => s + r.outcomeTotal, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
