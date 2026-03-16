'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import * as td from '@/lib/tenant-data';
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
  MedicalRecord,
  FosterHome,
  FosterPlacement,
  KennelLocation,
  AdoptionApplication,
} from '@/lib/types';

// Re-export mock data so pages can still use it for initial renders
// before Supabase hydrates.
export {
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
  mockMedicalRecords,
  mockFosterHomes,
  mockFosterPlacements,
  mockKennelLocations,
  mockAdoptionApplications,
} from '@/lib/mock-data';

/**
 * Generic hook that fetches tenant-scoped data asynchronously.
 * Falls back to `fallback` for the initial synchronous render, then
 * replaces it with the result of `fetcher` (which may come from
 * Supabase or still be mock data if Supabase isn't configured).
 */
function useFetch<T>(fetcher: (tenantId: string) => Promise<T>, fallback: T): T {
  const { currentTenant } = useAuth();
  const tenantId = currentTenant?.id ?? '';
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let cancelled = false;
    if (!tenantId) return;
    fetcher(tenantId).then(result => {
      if (!cancelled) setData(result);
    });
    return () => { cancelled = true; };
  }, [tenantId]); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}

export function usePeople(fallback: Person[] = []) {
  return useFetch(td.getPeople, fallback);
}

export function useAnimals(fallback: Animal[] = []) {
  return useFetch(td.getAnimals, fallback);
}

export function useOrganizations(fallback: Organization[] = []) {
  return useFetch(td.getOrganizations, fallback);
}

export function useDonations(fallback: Donation[] = []) {
  return useFetch(td.getDonations, fallback);
}

export function useAdopters(fallback: Adopter[] = []) {
  return useFetch(td.getAdopters, fallback);
}

export function useAdoptions(fallback: Adoption[] = []) {
  return useFetch(td.getAdoptions, fallback);
}

export function useTags(fallback: AdminTag[] = []) {
  return useFetch(td.getTags, fallback);
}

export function useAlertRules(fallback: AlertRule[] = []) {
  return useFetch(td.getAlertRules, fallback);
}

export function useUsers(fallback: User[] = []) {
  return useFetch(td.getUsers, fallback);
}

export function useDashboardStats(fallback?: DashboardStats) {
  const empty: DashboardStats = {
    totalPeople: 0, totalDonors: 0, totalVolunteers: 0,
    totalAnimals: 0, availableAnimals: 0, adoptionsThisMonth: 0,
    donationsThisMonth: 0, volunteerHoursThisMonth: 0, flaggedAdopters: 0,
    animalsInFoster: 0, liveReleaseRate: 0, averageLengthOfStay: 0,
  };
  return useFetch(td.getDashboardStats, fallback ?? empty);
}

export function useMedicalRecords(fallback: MedicalRecord[] = []) {
  return useFetch(td.getMedicalRecords, fallback);
}

export function useFosterHomes(fallback: FosterHome[] = []) {
  return useFetch(td.getFosterHomes, fallback);
}

export function useFosterPlacements(fallback: FosterPlacement[] = []) {
  return useFetch(td.getFosterPlacements, fallback);
}

export function useKennelLocations(fallback: KennelLocation[] = []) {
  return useFetch(td.getKennelLocations, fallback);
}

export function useAdoptionApplications(fallback: AdoptionApplication[] = []) {
  return useFetch(td.getAdoptionApplications, fallback);
}

export function useTaxLetters(year: number, fallback: TaxLetterRecord[] = []) {
  const { currentTenant } = useAuth();
  const tenantId = currentTenant?.id ?? '';
  const [data, setData] = useState<TaxLetterRecord[]>(fallback);

  useEffect(() => {
    let cancelled = false;
    if (!tenantId) return;
    td.buildTenantTaxLetters(tenantId, year).then(result => {
      if (!cancelled) setData(result);
    });
    return () => { cancelled = true; };
  }, [tenantId, year]);

  return data;
}
