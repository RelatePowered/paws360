/**
 * Tenant-scoped data access layer.
 *
 * All data is fetched from Supabase. The app requires a configured
 * Supabase instance to function.
 */

import { createBrowserSupabase } from './supabase-browser';
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
  Tenant,
  TaxLetterRecord,
  Move,
  StructuredNote,
  AnimalReturn,
  MedicalRecord,
  FosterHome,
  FosterPlacement,
  KennelLocation,
  AdoptionApplication,
} from './types';

// ========== Row → App-type mappers ==========
// Convert snake_case DB rows to camelCase app types.

function rowToTenant(r: Record<string, unknown>): Tenant {
  return {
    id: r.id as string,
    name: r.name as string,
    slug: r.slug as string,
    plan: (r.plan as Tenant['plan']) ?? 'starter',
    address: r.address as string | undefined,
    city: r.city as string | undefined,
    state: r.state as string | undefined,
    zip: r.zip as string | undefined,
    phone: r.phone as string | undefined,
    email: r.email as string | undefined,
    logoUrl: r.logo_url as string | undefined,
    website: r.website as string | undefined,
    ein: r.ein as string | undefined,
    createdAt: r.created_at as string,
    isActive: r.is_active as boolean,
  };
}

function rowToUser(r: Record<string, unknown>): User {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    email: r.email as string,
    firstName: r.first_name as string,
    lastName: r.last_name as string,
    role: r.role as User['role'],
    permissions: (r.permissions as User['permissions']) ?? {},
    isActive: r.is_active as boolean,
    createdAt: r.created_at as string,
    lastLoginAt: r.last_login_at as string | undefined,
    authUid: r.auth_uid as string | undefined,
  };
}

function rowToMove(r: Record<string, unknown>): Move {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    personId: r.person_id as string,
    fromRoles: r.from_roles as string[],
    toRoles: r.to_roles as string[],
    date: r.date as string,
    trigger: r.trigger as string | undefined,
  };
}

function rowToPerson(r: Record<string, unknown>, moves: Move[]): Person {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    firstName: r.first_name as string,
    lastName: r.last_name as string,
    email: r.email as string,
    phone: r.phone as string,
    address: r.address as string | undefined,
    city: r.city as string | undefined,
    state: r.state as string | undefined,
    zip: r.zip as string | undefined,
    roles: r.roles as string[],
    moves,
    tags: r.tags as string[],
    organizationId: r.organization_id as string | undefined,
    organizationName: r.organization_name as string | undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
    totalDonations: Number(r.total_donations),
    totalVolunteerHours: Number(r.total_volunteer_hours),
    isActive: r.is_active as boolean,
  };
}

function rowToOrganization(r: Record<string, unknown>): Organization {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    name: r.name as string,
    type: r.type as Organization['type'],
    ein: r.ein as string | undefined,
    contactName: r.contact_name as string,
    contactEmail: r.contact_email as string,
    contactPhone: r.contact_phone as string,
    address: r.address as string | undefined,
    city: r.city as string | undefined,
    state: r.state as string | undefined,
    zip: r.zip as string | undefined,
    memberIds: r.member_ids as string[],
    roles: r.roles as string[],
    totalDonations: Number(r.total_donations),
    totalVolunteerHours: Number(r.total_volunteer_hours),
    matchingGiftProgram: r.matching_gift_program as boolean,
    matchRatio: r.match_ratio as number | undefined,
    tags: r.tags as string[],
    notes: r.notes as string | undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
    isActive: r.is_active as boolean,
  };
}

function rowToDonation(r: Record<string, unknown>): Donation {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    personId: r.person_id as string | undefined,
    personName: r.person_name as string | undefined,
    organizationId: r.organization_id as string | undefined,
    organizationName: r.organization_name as string | undefined,
    type: r.type as Donation['type'],
    amount: r.amount as number | undefined,
    description: r.description as string,
    date: r.date as string,
    category: r.category as string,
    hours: r.hours as number | undefined,
    itemDescription: r.item_description as string | undefined,
    estimatedValue: r.estimated_value as number | undefined,
    receiptIssued: r.receipt_issued as boolean,
    notes: r.notes as string | undefined,
  };
}

function rowToAnimal(r: Record<string, unknown>): Animal {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    animalId: r.animal_id as string,
    name: r.name as string,
    species: r.species as Animal['species'],
    breed: r.breed as string,
    color: r.color as string,
    gender: r.gender as Animal['gender'],
    size: r.size as Animal['size'],
    age: r.age as string | undefined,
    dateOfBirth: r.date_of_birth as string | undefined,
    weight: r.weight as number | undefined,
    microchipId: r.microchip_id as string | undefined,
    status: r.status as Animal['status'],
    intakeDate: r.intake_date as string,
    intakeType: r.intake_type as Animal['intakeType'],
    intakeCondition: (r.intake_condition as Animal['intakeCondition']) ?? 'healthy',
    intakePersonId: r.intake_person_id as string | undefined,
    intakePersonName: r.intake_person_name as string | undefined,
    alteredStatus: (r.altered_status as Animal['alteredStatus']) ?? 'unknown',
    description: r.description as string,
    medicalNotes: r.medical_notes as string[],
    tags: r.tags as string[],
    photoUrl: r.photo_url as string | undefined,
    kennelLocation: r.kennel_location as string | undefined,
    holdExpirationDate: r.hold_expiration_date as string | undefined,
    outcomeType: r.outcome_type as Animal['outcomeType'],
    outcomeDate: r.outcome_date as string | undefined,
    fosterHomeId: r.foster_home_id as string | undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function rowToMedicalRecord(r: Record<string, unknown>): MedicalRecord {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    animalId: r.animal_id as string,
    type: r.type as MedicalRecord['type'],
    description: r.description as string,
    date: r.date as string,
    veterinarian: r.veterinarian as string | undefined,
    notes: r.notes as string | undefined,
    nextDueDate: r.next_due_date as string | undefined,
    createdAt: r.created_at as string,
  };
}

function rowToFosterHome(r: Record<string, unknown>): FosterHome {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    personId: r.person_id as string | undefined,
    firstName: r.first_name as string,
    lastName: r.last_name as string,
    email: r.email as string,
    phone: r.phone as string,
    address: r.address as string | undefined,
    city: r.city as string | undefined,
    state: r.state as string | undefined,
    zip: r.zip as string | undefined,
    capacity: Number(r.capacity),
    currentCount: Number(r.current_count),
    speciesPreference: r.species_preference as FosterHome['speciesPreference'],
    sizePreference: r.size_preference as FosterHome['sizePreference'],
    isActive: r.is_active as boolean,
    notes: r.notes as string | undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function rowToFosterPlacement(r: Record<string, unknown>): FosterPlacement {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    animalId: r.animal_id as string,
    animalName: r.animal_name as string,
    fosterHomeId: r.foster_home_id as string,
    fosterName: r.foster_name as string,
    startDate: r.start_date as string,
    endDate: r.end_date as string | undefined,
    status: r.status as FosterPlacement['status'],
    notes: r.notes as string | undefined,
    createdAt: r.created_at as string,
  };
}

function rowToKennelLocation(r: Record<string, unknown>): KennelLocation {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    name: r.name as string,
    zone: r.zone as string,
    species: r.species as KennelLocation['species'],
    size: r.size as KennelLocation['size'],
    isOccupied: r.is_occupied as boolean,
    currentAnimalId: r.current_animal_id as string | undefined,
    currentAnimalName: r.current_animal_name as string | undefined,
    notes: r.notes as string | undefined,
  };
}

function rowToAdminTag(r: Record<string, unknown>): AdminTag {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    label: r.label as string,
    category: r.category as AdminTag['category'],
    severity: r.severity as AdminTag['severity'],
    isActive: r.is_active as boolean,
    createdAt: r.created_at as string,
  };
}

function rowToAlertRule(r: Record<string, unknown>): AlertRule {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    name: r.name as string,
    description: r.description as string,
    condition: r.condition as AlertRule['condition'],
    threshold: Number(r.threshold),
    severity: r.severity as AlertRule['severity'],
    isActive: r.is_active as boolean,
  };
}

function rowToStructuredNote(r: Record<string, unknown>): StructuredNote {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    tagId: r.tag_id as string,
    tagLabel: r.tag_label as string,
    severity: r.severity as StructuredNote['severity'],
    date: r.date as string,
    addedBy: r.added_by as string,
  };
}

function rowToAnimalReturn(r: Record<string, unknown>): AnimalReturn {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    adoptionId: r.adoption_id as string,
    animalId: r.animal_id as string,
    animalName: r.animal_name as string,
    adopterId: r.adopter_id as string,
    date: r.date as string,
    reasonTagId: r.reason_tag_id as string,
    reasonLabel: r.reason_label as string,
  };
}

function rowToAdoption(r: Record<string, unknown>): Adoption {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    animalId: r.animal_id as string,
    animalName: r.animal_name as string,
    adopterId: r.adopter_id as string,
    adopterName: r.adopter_name as string,
    date: r.date as string,
    fee: Number(r.fee),
    status: r.status as Adoption['status'],
    returnDate: r.return_date as string | undefined,
    returnReason: r.return_reason as string | undefined,
    checkoutDonation: r.checkout_donation != null ? Number(r.checkout_donation) : undefined,
  };
}

// ========== Data access functions ==========

function getSupabase() {
  const sb = createBrowserSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  return sb;
}

export async function getTenants(): Promise<Tenant[]> {
  const sb = getSupabase();
  const { data } = await sb.from('tenants').select('*').eq('is_active', true);
  return (data ?? []).map(r => rowToTenant(r as Record<string, unknown>));
}

export async function updateTenant(
  tenantId: string,
  fields: Partial<{
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    logoUrl: string;
    website: string;
    ein: string;
  }>
): Promise<void> {
  const sb = getSupabase();
  // Map camelCase fields to snake_case DB columns.
  // Convert empty strings to null so optional DB columns don't receive
  // invalid empty values (e.g. email format constraints, EIN checks).
  const toNullable = (v: string | undefined): string | null =>
    v === undefined ? null : (v.trim() === '' ? null : v.trim());

  const row: Record<string, unknown> = {};
  if (fields.name !== undefined) row.name = fields.name || null;
  if (fields.address !== undefined) row.address = toNullable(fields.address);
  if (fields.city !== undefined) row.city = toNullable(fields.city);
  if (fields.state !== undefined) row.state = toNullable(fields.state);
  if (fields.zip !== undefined) row.zip = toNullable(fields.zip);
  if (fields.phone !== undefined) row.phone = toNullable(fields.phone);
  if (fields.email !== undefined) row.email = toNullable(fields.email);
  if (fields.logoUrl !== undefined) {
    const url = toNullable(fields.logoUrl);
    // Only allow https:// URLs for logo to prevent XSS via javascript: or data: URIs
    row.logo_url = url && /^https?:\/\//i.test(url) ? url : null;
  }
  if (fields.website !== undefined) row.website = toNullable(fields.website);
  if (fields.ein !== undefined) row.ein = toNullable(fields.ein);
  const { error } = await sb.from('tenants').update(row as Record<string, unknown> as never).eq('id', tenantId);
  if (error) throw error;
}

export async function getUsers(tenantId: string): Promise<User[]> {
  const sb = getSupabase();
  const { data } = await sb.from('users').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToUser(r as Record<string, unknown>));
}

export async function getPeople(tenantId: string): Promise<Person[]> {
  const sb = getSupabase();
  const [{ data: peopleRows }, { data: moveRows }] = await Promise.all([
    sb.from('people').select('*').eq('tenant_id', tenantId),
    sb.from('moves').select('*').eq('tenant_id', tenantId),
  ]);
  const moves = (moveRows ?? []).map(r => rowToMove(r as Record<string, unknown>));
  return (peopleRows ?? []).map(r =>
    rowToPerson(r as Record<string, unknown>, moves.filter(m => m.personId === (r as Record<string, unknown>).id))
  );
}

export async function getAnimals(tenantId: string): Promise<Animal[]> {
  const sb = getSupabase();
  const { data } = await sb.from('animals').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToAnimal(r as Record<string, unknown>));
}

export async function getOrganizations(tenantId: string): Promise<Organization[]> {
  const sb = getSupabase();
  const { data } = await sb.from('organizations').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToOrganization(r as Record<string, unknown>));
}

export async function getDonations(tenantId: string): Promise<Donation[]> {
  const sb = getSupabase();
  const { data } = await sb.from('donations').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToDonation(r as Record<string, unknown>));
}

export async function createDonation(
  tenantId: string,
  input: {
    type: Donation['type'];
    description: string;
    date: string;
    category: string;
    personName?: string;
    amount?: number;
    hours?: number;
    itemDescription?: string;
    estimatedValue?: number;
    receiptIssued?: boolean;
    notes?: string;
  }
): Promise<Donation> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const row = {
    id,
    tenant_id: tenantId,
    type: input.type,
    description: input.description,
    date: input.date,
    category: input.category,
    person_name: input.personName ?? null,
    amount: input.amount ?? null,
    hours: input.hours ?? null,
    item_description: input.itemDescription ?? null,
    estimated_value: input.estimatedValue ?? null,
    receipt_issued: input.receiptIssued ?? false,
    notes: input.notes ?? null,
  };
  const { error } = await sb.from('donations').insert(row as never);
  if (error) throw error;
  return rowToDonation(row as Record<string, unknown>);
}

export async function getAdopters(tenantId: string): Promise<Adopter[]> {
  const sb = getSupabase();
  const [{ data: adopterRows }, { data: noteRows }, { data: adoptionRows }, { data: returnRows }] =
    await Promise.all([
      sb.from('adopters').select('*').eq('tenant_id', tenantId),
      sb.from('structured_notes').select('*').eq('tenant_id', tenantId),
      sb.from('adoptions').select('*').eq('tenant_id', tenantId),
      sb.from('animal_returns').select('*').eq('tenant_id', tenantId),
    ]);

  const notes = (noteRows ?? []).map(r => rowToStructuredNote(r as Record<string, unknown>));
  const adoptions = (adoptionRows ?? []).map(r => rowToAdoption(r as Record<string, unknown>));
  const returns = (returnRows ?? []).map(r => rowToAnimalReturn(r as Record<string, unknown>));

  return (adopterRows ?? []).map(r => {
    const row = r as Record<string, unknown>;
    const id = row.id as string;
    const adopterNoteRows = (noteRows ?? []).filter(
      nr => (nr as Record<string, unknown>).adopter_id === id
    );
    return {
      id,
      tenantId: row.tenant_id as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      email: row.email as string,
      phone: row.phone as string,
      address: row.address as string | undefined,
      city: row.city as string | undefined,
      state: row.state as string | undefined,
      zip: row.zip as string | undefined,
      structuredNotes: adopterNoteRows.map(r2 => rowToStructuredNote(r2 as Record<string, unknown>)),
      adoptionHistory: adoptions.filter(a => a.adopterId === id),
      returnHistory: returns.filter(ret => ret.adopterId === id),
      flagged: row.flagged as boolean,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    } as Adopter;
  });
}

export async function createAdopter(
  tenantId: string,
  input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<Adopter> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const row = {
    id,
    tenant_id: tenantId,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    address: input.address ?? null,
    city: input.city ?? null,
    state: input.state ?? null,
    zip: input.zip ?? null,
    flagged: false,
    created_at: now,
    updated_at: now,
  };
  const { error } = await sb.from('adopters').insert(row as never);
  if (error) throw error;
  return {
    id,
    tenantId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state,
    zip: input.zip,
    structuredNotes: [],
    adoptionHistory: [],
    returnHistory: [],
    flagged: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getAdoptions(tenantId: string): Promise<Adoption[]> {
  const sb = getSupabase();
  const { data } = await sb.from('adoptions').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToAdoption(r as Record<string, unknown>));
}

export async function createAdoption(
  tenantId: string,
  input: {
    animalId: string;
    animalName: string;
    adopterId: string;
    adopterName: string;
    date: string;
    fee: number;
    checkoutDonation?: number;
  }
): Promise<Adoption> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const row = {
    id,
    tenant_id: tenantId,
    animal_id: input.animalId,
    animal_name: input.animalName,
    adopter_id: input.adopterId,
    adopter_name: input.adopterName,
    date: input.date,
    fee: input.fee,
    status: 'completed',
    checkout_donation: input.checkoutDonation ?? null,
  };
  const { error } = await sb.from('adoptions').insert(row as never);
  if (error) throw error;
  return rowToAdoption(row as Record<string, unknown>);
}

export async function getTags(tenantId: string): Promise<AdminTag[]> {
  const sb = getSupabase();
  const { data } = await sb.from('admin_tags').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToAdminTag(r as Record<string, unknown>));
}

export async function getAlertRules(tenantId: string): Promise<AlertRule[]> {
  const sb = getSupabase();
  const { data } = await sb.from('alert_rules').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToAlertRule(r as Record<string, unknown>));
}

export async function getDashboardStats(tenantId: string): Promise<DashboardStats> {
  const sb = getSupabase();

  // Compute stats from live data
  const [people, animals, donations, adopters, adoptions] = await Promise.all([
    getPeople(tenantId),
    getAnimals(tenantId),
    getDonations(tenantId),
    getAdopters(tenantId),
    getAdoptions(tenantId),
  ]);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthDonations = donations.filter(d => d.date.startsWith(thisMonth));
  const monthAdoptions = adoptions.filter(a => a.date.startsWith(thisMonth) && a.status === 'completed');

  const animalsInFoster = animals.filter(a => a.status === 'foster').length;
  const liveStatuses = ['adopted', 'available', 'foster', 'transferred'];
  const deadStatuses = ['deceased', 'euthanized'];
  const outcomeAnimals = animals.filter(a => [...liveStatuses.slice(0, 1), ...liveStatuses.slice(3), ...deadStatuses].includes(a.status) || a.outcomeType);
  const liveOutcomes = outcomeAnimals.filter(a => a.outcomeType === 'adoption' || a.outcomeType === 'return-to-owner' || a.outcomeType === 'transfer-out').length;
  const totalOutcomes = outcomeAnimals.filter(a => a.outcomeType).length;
  const liveReleaseRate = totalOutcomes > 0 ? Math.round((liveOutcomes / totalOutcomes) * 1000) / 10 : 0;

  const today = new Date();
  const animalDays = animals.filter(a => a.status !== 'deceased' && a.status !== 'euthanized').map(a => {
    const intake = new Date(a.intakeDate);
    const outcome = a.outcomeDate ? new Date(a.outcomeDate) : today;
    return Math.ceil((outcome.getTime() - intake.getTime()) / (1000 * 60 * 60 * 24));
  });
  const averageLengthOfStay = animalDays.length > 0 ? Math.round(animalDays.reduce((s, d) => s + d, 0) / animalDays.length) : 0;

  return {
    totalPeople: people.length,
    totalDonors: people.filter(p => p.roles.includes('donor')).length,
    totalVolunteers: people.filter(p => p.roles.includes('volunteer')).length,
    totalAnimals: animals.length,
    availableAnimals: animals.filter(a => a.status === 'available').length,
    adoptionsThisMonth: monthAdoptions.length,
    donationsThisMonth: monthDonations.reduce((s, d) => s + (d.amount ?? d.estimatedValue ?? 0), 0),
    volunteerHoursThisMonth: monthDonations.filter(d => d.type === 'time').reduce((s, d) => s + (d.hours ?? 0), 0),
    flaggedAdopters: adopters.filter(a => a.flagged).length,
    animalsInFoster,
    liveReleaseRate,
    averageLengthOfStay,
  };
}

export async function createMedicalRecord(
  tenantId: string,
  input: {
    animalId: string;
    type: MedicalRecord['type'];
    description: string;
    date: string;
    veterinarian?: string;
    notes?: string;
    nextDueDate?: string;
  }
): Promise<MedicalRecord> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString().split('T')[0];
  const row = {
    id,
    tenant_id: tenantId,
    animal_id: input.animalId,
    type: input.type,
    description: input.description,
    date: input.date,
    veterinarian: input.veterinarian ?? null,
    notes: input.notes ?? null,
    next_due_date: input.nextDueDate ?? null,
    created_at: now,
  };
  const { error } = await sb.from('medical_records').insert(row as never);
  if (error) throw error;
  return rowToMedicalRecord(row as Record<string, unknown>);
}

export async function getMedicalRecords(tenantId: string): Promise<MedicalRecord[]> {
  const sb = getSupabase();
  const { data } = await sb.from('medical_records').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToMedicalRecord(r as Record<string, unknown>));
}

export async function getFosterHomes(tenantId: string): Promise<FosterHome[]> {
  const sb = getSupabase();
  const { data } = await sb.from('foster_homes').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToFosterHome(r as Record<string, unknown>));
}

export async function getFosterPlacements(tenantId: string): Promise<FosterPlacement[]> {
  const sb = getSupabase();
  const { data } = await sb.from('foster_placements').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToFosterPlacement(r as Record<string, unknown>));
}

export async function getAdoptionApplications(tenantId: string): Promise<AdoptionApplication[]> {
  const sb = getSupabase();
  const { data } = await sb.from('adoption_applications').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id as string,
      tenantId: row.tenant_id as string,
      animalId: row.animal_id as string,
      animalName: row.animal_name as string,
      applicantName: row.applicant_name as string,
      applicantEmail: row.applicant_email as string,
      applicantPhone: row.applicant_phone as string,
      address: row.address as string | undefined,
      city: row.city as string | undefined,
      state: row.state as string | undefined,
      zip: row.zip as string | undefined,
      householdType: row.household_type as AdoptionApplication['householdType'],
      hasYard: row.has_yard as boolean,
      hasFence: row.has_fence as boolean,
      otherPets: row.other_pets as string,
      otherPetsDetails: row.other_pets_details as string | undefined,
      hasChildren: row.has_children as boolean,
      childrenAges: row.children_ages as string | undefined,
      experience: row.experience as string,
      veterinarianName: row.veterinarian_name as string | undefined,
      veterinarianPhone: row.veterinarian_phone as string | undefined,
      reasonForAdopting: row.reason_for_adopting as string,
      status: row.status as AdoptionApplication['status'],
      reviewNotes: row.review_notes as string | undefined,
      reviewedBy: row.reviewed_by as string | undefined,
      submittedAt: row.submitted_at as string,
      reviewedAt: row.reviewed_at as string | undefined,
    };
  });
}

export async function createAnimal(
  tenantId: string,
  input: {
    name: string;
    species: Animal['species'];
    breed: string;
    color: string;
    gender: Animal['gender'];
    size: Animal['size'];
    age?: string;
    dateOfBirth?: string;
    weight?: number;
    microchipId?: string;
    intakeType: Animal['intakeType'];
    intakeCondition: Animal['intakeCondition'];
    alteredStatus: Animal['alteredStatus'];
    description: string;
    kennelLocation?: string;
    photoUrl?: string;
  }
): Promise<Animal> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString().split('T')[0];
  // Generate human-readable ID
  const speciesPrefix = input.species === 'dog' ? 'DOG' : input.species === 'cat' ? 'CAT' : input.species.toUpperCase().slice(0, 3);
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  const animalId = `${speciesPrefix}-${year}-${seq}`;
  const row = {
    id,
    tenant_id: tenantId,
    animal_id: animalId,
    name: input.name,
    species: input.species,
    breed: input.breed,
    color: input.color,
    gender: input.gender,
    size: input.size,
    age: input.age ?? null,
    date_of_birth: input.dateOfBirth ?? null,
    weight: input.weight ?? null,
    microchip_id: input.microchipId ?? null,
    status: 'intake',
    intake_date: now,
    intake_type: input.intakeType,
    intake_condition: input.intakeCondition,
    altered_status: input.alteredStatus,
    description: input.description,
    medical_notes: [],
    tags: [],
    photo_url: input.photoUrl ?? null,
    kennel_location: input.kennelLocation ?? null,
    created_at: now,
    updated_at: now,
  };
  const { error } = await sb.from('animals').insert(row as never);
  if (error) throw error;
  return rowToAnimal(row as Record<string, unknown>);
}

export async function createPerson(
  tenantId: string,
  input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roles: string[];
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<Person> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString().split('T')[0];
  const row = {
    id,
    tenant_id: tenantId,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    roles: input.roles,
    tags: [],
    address: input.address ?? null,
    city: input.city ?? null,
    state: input.state ?? null,
    zip: input.zip ?? null,
    total_donations: 0,
    total_volunteer_hours: 0,
    is_active: true,
    created_at: now,
    updated_at: now,
  };
  const { error } = await sb.from('people').insert(row as never);
  if (error) throw error;
  return rowToPerson(row as Record<string, unknown>, []);
}

export async function createOrganization(
  tenantId: string,
  input: {
    name: string;
    type: Organization['type'];
    ein?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    roles?: string[];
    matchingGiftProgram?: boolean;
  }
): Promise<Organization> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString().split('T')[0];
  const row = {
    id,
    tenant_id: tenantId,
    name: input.name,
    type: input.type,
    ein: input.ein ?? null,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone,
    address: input.address ?? null,
    city: input.city ?? null,
    state: input.state ?? null,
    zip: input.zip ?? null,
    member_ids: [],
    roles: input.roles ?? [],
    total_donations: 0,
    total_volunteer_hours: 0,
    matching_gift_program: input.matchingGiftProgram ?? false,
    tags: [],
    is_active: true,
    created_at: now,
    updated_at: now,
  };
  const { error } = await sb.from('organizations').insert(row as never);
  if (error) throw error;
  return rowToOrganization(row as Record<string, unknown>);
}

export async function createFosterHome(
  tenantId: string,
  input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    capacity: number;
    notes?: string;
  }
): Promise<FosterHome> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString().split('T')[0];
  const row = {
    id,
    tenant_id: tenantId,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    address: input.address ?? null,
    city: input.city ?? null,
    state: input.state ?? null,
    zip: input.zip ?? null,
    capacity: input.capacity,
    current_count: 0,
    species_preference: [],
    size_preference: [],
    is_active: true,
    notes: input.notes ?? null,
    created_at: now,
    updated_at: now,
  };
  const { error } = await sb.from('foster_homes').insert(row as never);
  if (error) throw error;
  return rowToFosterHome(row as Record<string, unknown>);
}

export async function createTag(
  tenantId: string,
  input: {
    label: string;
    category: AdminTag['category'];
    severity?: AdminTag['severity'];
  }
): Promise<AdminTag> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString().split('T')[0];
  const row = {
    id,
    tenant_id: tenantId,
    label: input.label,
    category: input.category,
    severity: input.severity ?? null,
    is_active: true,
    created_at: now,
  };
  const { error } = await sb.from('admin_tags').insert(row as never);
  if (error) throw error;
  return rowToAdminTag(row as Record<string, unknown>);
}

export async function createAlertRule(
  tenantId: string,
  input: {
    name: string;
    description: string;
    condition: AlertRule['condition'];
    threshold: number;
    severity: AlertRule['severity'];
  }
): Promise<AlertRule> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const row = {
    id,
    tenant_id: tenantId,
    name: input.name,
    description: input.description,
    condition: input.condition,
    threshold: input.threshold,
    severity: input.severity,
    is_active: true,
  };
  const { error } = await sb.from('alert_rules').insert(row as never);
  if (error) throw error;
  return rowToAlertRule(row as Record<string, unknown>);
}

export async function createUser(
  tenantId: string,
  input: {
    firstName: string;
    lastName: string;
    email: string;
    role: User['role'];
  }
): Promise<User> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString().split('T')[0];
  const row = {
    id,
    tenant_id: tenantId,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    role: input.role,
    permissions: {},
    is_active: true,
    created_at: now,
  };
  const { error } = await sb.from('users').insert(row as never);
  if (error) throw error;
  return rowToUser(row as Record<string, unknown>);
}

export async function createKennelLocation(
  tenantId: string,
  input: {
    name: string;
    zone: string;
    species: KennelLocation['species'];
    size: KennelLocation['size'];
  }
): Promise<KennelLocation> {
  const sb = getSupabase();
  const id = crypto.randomUUID();
  const row = {
    id,
    tenant_id: tenantId,
    name: input.name,
    zone: input.zone,
    species: input.species,
    size: input.size,
    is_occupied: false,
  };
  const { error } = await sb.from('kennel_locations').insert(row as never);
  if (error) throw error;
  return rowToKennelLocation(row as Record<string, unknown>);
}

export async function getKennelLocations(tenantId: string): Promise<KennelLocation[]> {
  const sb = getSupabase();
  const { data } = await sb.from('kennel_locations').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToKennelLocation(r as Record<string, unknown>));
}

export async function buildTenantTaxLetters(tenantId: string, year: number): Promise<TaxLetterRecord[]> {
  const [tenantPeople, tenantDonations, tenantOrgs] = await Promise.all([
    getPeople(tenantId),
    getDonations(tenantId),
    getOrganizations(tenantId),
  ]);

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
