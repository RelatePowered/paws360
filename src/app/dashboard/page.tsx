'use client';

import {
  Users,
  PawPrint,
  Heart,
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  Shield,
  Home,
  Calendar,
  Syringe,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import AnimalPhoto from '@/components/ui/AnimalPhoto';
import { useDashboardStats, useAnimals, useDonations, useAdopters, useMedicalRecords } from '@/hooks/useTenantData';
import { formatCurrency, formatDate, getStatusBadgeColor, getSeverityColor } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = useDashboardStats();
  const animals = useAnimals();
  const donations = useDonations();
  const adopters = useAdopters();
  const medicalRecords = useMedicalRecords();

  // Vaccination alerts: records with nextDueDate within 30 days or overdue
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const vaccinationAlerts = medicalRecords
    .filter(r => r.type === 'vaccination' && r.nextDueDate)
    .map(r => {
      const dueDate = new Date(r.nextDueDate!);
      const animal = animals.find(a => a.id === r.animalId);
      const isOverdue = dueDate < today;
      const isDueSoon = dueDate <= thirtyDaysFromNow && dueDate >= today;
      return { record: r, animal, dueDate, isOverdue, isDueSoon };
    })
    .filter(v => v.isOverdue || v.isDueSoon)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Overview of your shelter operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Animals"
          value={stats.totalAnimals}
          subtitle={`${stats.availableAnimals} available, ${stats.animalsInFoster} in foster`}
          icon={<PawPrint className="w-5 h-5" />}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Live Release Rate"
          value={`${stats.liveReleaseRate}%`}
          subtitle={stats.liveReleaseRate >= 90 ? 'No-kill benchmark met' : 'Below 90% no-kill benchmark'}
          icon={<Shield className="w-5 h-5" />}
          iconColor={stats.liveReleaseRate >= 90 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
        />
        <StatCard
          title="Donations This Month"
          value={formatCurrency(stats.donationsThisMonth)}
          subtitle={`${stats.adoptionsThisMonth} adoption(s) this month`}
          icon={<DollarSign className="w-5 h-5" />}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Avg Length of Stay"
          value={`${stats.averageLengthOfStay}d`}
          subtitle={`${stats.totalPeople} people, ${stats.volunteerHoursThisMonth}h volunteer`}
          icon={<Calendar className="w-5 h-5" />}
          iconColor="bg-info/10 text-info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagged Adopters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger" />
                <h2 className="font-semibold">Flagged Adopters</h2>
              </div>
              <Link href="/adoptions" className="text-sm text-primary hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardBody>
            {adopters.filter(a => a.flagged).length === 0 ? (
              <p className="text-muted text-sm text-center py-4">No flagged adopters</p>
            ) : (
              <div className="space-y-3">
                {adopters.filter(a => a.flagged).map(adopter => (
                  <div key={adopter.id} className="flex items-center justify-between p-3 rounded-lg bg-danger/5 border border-danger/20">
                    <div>
                      <p className="text-sm font-medium">{adopter.firstName} {adopter.lastName}</p>
                      <p className="text-xs text-muted">{adopter.returnHistory.length} return(s)</p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {adopter.structuredNotes.map(note => (
                        <Badge key={note.id} className={getSeverityColor(note.severity)}>
                          {note.tagLabel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <h2 className="font-semibold">Recent Donations</h2>
              </div>
              <Link href="/donations" className="text-sm text-primary hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {donations.slice(0, 5).map(donation => (
                <div key={donation.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center text-success">
                      {donation.type === 'monetary' ? <DollarSign className="w-4 h-4" /> :
                       donation.type === 'time' ? <Clock className="w-4 h-4" /> :
                       <Heart className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{donation.personName}</p>
                      <p className="text-xs text-muted">{donation.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {donation.type === 'monetary' ? formatCurrency(donation.amount!) :
                       donation.type === 'time' ? `${donation.hours}h` :
                       formatCurrency(donation.estimatedValue || 0)}
                    </p>
                    <p className="text-xs text-muted">{formatDate(donation.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Vaccination Alerts */}
      {vaccinationAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-warning" />
                <h2 className="font-semibold">Vaccination Alerts</h2>
                <Badge className="bg-warning/10 text-warning">{vaccinationAlerts.length}</Badge>
              </div>
              <Link href="/animals" className="text-sm text-primary hover:underline">View animals</Link>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {vaccinationAlerts.slice(0, 8).map(({ record, animal, dueDate, isOverdue }) => (
                <div
                  key={record.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isOverdue
                      ? 'bg-danger/5 border-danger/20'
                      : 'bg-warning/5 border-warning/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Syringe className={`w-4 h-4 ${isOverdue ? 'text-danger' : 'text-warning'}`} />
                    <div>
                      <p className="text-sm font-medium">{animal?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-muted">{record.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={isOverdue
                      ? 'bg-danger/10 text-danger'
                      : 'bg-warning/10 text-warning'
                    }>
                      {isOverdue ? 'Overdue' : 'Due Soon'}
                    </Badge>
                    <p className="text-xs text-muted mt-1">{formatDate(record.nextDueDate!)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Available Animals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Animals Available for Adoption</h2>
            </div>
            <Link href="/animals" className="text-sm text-primary hover:underline">View all</Link>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {animals.filter(a => a.status === 'available').map(animal => (
              <div key={animal.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3 mb-2">
                  <AnimalPhoto photoKey={animal.photoUrl} alt={animal.name} size="sm" />
                  <div className="flex-1 flex items-start justify-between">
                    <div>
                      <p className="font-medium">{animal.name}</p>
                      <p className="text-xs text-muted">{animal.animalId}</p>
                    </div>
                    <Badge className={getStatusBadgeColor(animal.status)}>{animal.status}</Badge>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted">
                  <p>{animal.breed} &middot; {animal.color}</p>
                  <p>{animal.age} &middot; {animal.gender} &middot; {animal.size}</p>
                </div>
                {animal.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {animal.tags.map(tag => (
                      <Badge key={tag} className="bg-primary/10 text-primary text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
