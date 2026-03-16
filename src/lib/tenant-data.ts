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

export async function getAdoptions(tenantId: string): Promise<Adoption[]> {
  const sb = getSupabase();
  const { data } = await sb.from('adoptions').select('*').eq('tenant_id', tenantId);
  return (data ?? []).map(r => rowToAdoption(r as Record<string, unknown>));
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
  const [people, animals, donations, adopters] = await Promise.all([
    getPeople(tenantId),
    getAnimals(tenantId),
    getDonations(tenantId),
    getAdopters(tenantId),
  ]);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthDonations = donations.filter(d => d.date.startsWith(thisMonth));

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
    adoptionsThisMonth: 0,
    donationsThisMonth: monthDonations.reduce((s, d) => s + (d.amount ?? d.estimatedValue ?? 0), 0),
    volunteerHoursThisMonth: monthDonations.filter(d => d.type === 'time').reduce((s, d) => s + (d.hours ?? 0), 0),
    flaggedAdopters: adopters.filter(a => a.flagged).length,
    animalsInFoster,
    liveReleaseRate,
    averageLengthOfStay,
  };
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
