/**
 * Tenant-scoped data access layer.
 *
 * Every query function takes a tenantId and returns only data belonging
 * to that tenant. This ensures no cross-tenant data leakage at the data
 * access boundary — regardless of what the UI does, the data layer will
 * never return records from another tenant.
 */

import {
  mockPeople,
  mockAnimals,
  mockOrganizations,
  mockDonations,
  mockAdopters,
  mockAdoptions,
  mockTags,
  mockAlertRules,
  mockUsers,
  mockDashboardStats,
} from './mock-data';
import type {
  Person,
  Animal,
  Organization,
  Donation,
  Adopter,
  Adoption,
  AdminTag,
  AlertRule,
  DashboardStats,
  User,
  TaxLetterRecord,
} from './types';

// ========== Filtering helpers ==========

export function getPeople(tenantId: string): Person[] {
  return mockPeople.filter(p => p.tenantId === tenantId);
}

export function getAnimals(tenantId: string): Animal[] {
  return mockAnimals.filter(a => a.tenantId === tenantId);
}

export function getOrganizations(tenantId: string): Organization[] {
  return mockOrganizations.filter(o => o.tenantId === tenantId);
}

export function getDonations(tenantId: string): Donation[] {
  return mockDonations.filter(d => d.tenantId === tenantId);
}

export function getAdopters(tenantId: string): Adopter[] {
  return mockAdopters.filter(a => a.tenantId === tenantId);
}

export function getAdoptions(tenantId: string): Adoption[] {
  return mockAdoptions.filter(a => a.tenantId === tenantId);
}

export function getTags(tenantId: string): AdminTag[] {
  return mockTags.filter(t => t.tenantId === tenantId);
}

export function getAlertRules(tenantId: string): AlertRule[] {
  return mockAlertRules.filter(r => r.tenantId === tenantId);
}

export function getUsers(tenantId: string): User[] {
  return mockUsers.filter(u => u.tenantId === tenantId);
}

export function getDashboardStats(tenantId: string): DashboardStats {
  // In a real app this would be computed from tenant-scoped data.
  // For now return the static mock stats (all mock data belongs to tenant-1).
  if (tenantId === 'tenant-1') return mockDashboardStats;
  return {
    totalPeople: 0,
    totalDonors: 0,
    totalVolunteers: 0,
    totalAnimals: 0,
    availableAnimals: 0,
    adoptionsThisMonth: 0,
    donationsThisMonth: 0,
    volunteerHoursThisMonth: 0,
    flaggedAdopters: 0,
  };
}

export function buildTenantTaxLetters(tenantId: string, year: number): TaxLetterRecord[] {
  const tenantPeople = getPeople(tenantId);
  const tenantDonations = getDonations(tenantId);
  const tenantOrgs = getOrganizations(tenantId);

  const letters: TaxLetterRecord[] = [];

  // Individual letters
  const peopleWithDonations = tenantPeople.filter(p =>
    tenantDonations.some(d => d.personId === p.id && !d.organizationId && new Date(d.date).getFullYear() === year && (d.type === 'monetary' || d.type === 'in-kind'))
  );
  for (const person of peopleWithDonations) {
    const donations = tenantDonations.filter(d => d.personId === person.id && !d.organizationId && new Date(d.date).getFullYear() === year && (d.type === 'monetary' || d.type === 'in-kind'));
    const totalMonetary = donations.filter(d => d.type === 'monetary').reduce((s, d) => s + (d.amount || 0), 0);
    const totalInKind = donations.filter(d => d.type === 'in-kind').reduce((s, d) => s + (d.estimatedValue || 0), 0);
    letters.push({
      id: `tl-ind-${person.id}-${year}`,
      tenantId,
      recipientType: 'individual',
      recipientId: person.id,
      recipientName: `${person.firstName} ${person.lastName}`,
      address: [person.address, person.city, person.state, person.zip].filter(Boolean).join(', '),
      taxYear: year,
      totalMonetary,
      totalInKind,
      totalCombined: totalMonetary + totalInKind,
      donations,
      generatedAt: '',
      status: 'draft',
    });
  }

  // Organization letters
  for (const org of tenantOrgs) {
    const donations = tenantDonations.filter(d => d.organizationId === org.id && new Date(d.date).getFullYear() === year && (d.type === 'monetary' || d.type === 'in-kind'));
    if (donations.length === 0) continue;
    const totalMonetary = donations.filter(d => d.type === 'monetary').reduce((s, d) => s + (d.amount || 0), 0);
    const totalInKind = donations.filter(d => d.type === 'in-kind').reduce((s, d) => s + (d.estimatedValue || 0), 0);
    letters.push({
      id: `tl-org-${org.id}-${year}`,
      tenantId,
      recipientType: 'organization',
      recipientId: org.id,
      recipientName: org.name,
      ein: org.ein,
      address: [org.address, org.city, org.state, org.zip].filter(Boolean).join(', '),
      taxYear: year,
      totalMonetary,
      totalInKind,
      totalCombined: totalMonetary + totalInKind,
      donations,
      generatedAt: '',
      status: 'draft',
    });
  }

  return letters.sort((a, b) => b.totalCombined - a.totalCombined);
}
