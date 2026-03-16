// ========== Multi-Tenancy & User Types ==========

export interface Tenant {
  id: string;
  name: string; // e.g., "Springfield Humane Society"
  slug: string; // URL-friendly identifier
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  createdAt: string;
  isActive: boolean;
}

export type UserRole = 'super_admin' | 'admin' | 'staff';

/** Modules that can be independently granted view/edit access. */
export type AppModule =
  | 'dashboard'
  | 'people'
  | 'animals'
  | 'adoptions'
  | 'donations'
  | 'organizations'
  | 'reports'
  | 'admin'
  | 'foster'
  | 'kennels';

/** Per-module permission level. */
export type PermissionLevel = 'none' | 'view' | 'edit';

/**
 * Map of module → permission level.
 * Stored as JSONB in the users table; missing keys default to 'none'.
 */
export type ModulePermissions = Partial<Record<AppModule, PermissionLevel>>;

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: ModulePermissions;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  /** Supabase Auth UUID — links this app user to a Supabase auth.users row. */
  authUid?: string;
}

// ========== Core Types ==========

export type PersonRole = 'donor' | 'volunteer' | 'adopter' | 'donor-volunteer' | 'donor-adopter' | 'volunteer-adopter' | 'all';

// Moves Management: tracks how a person's relationship with the shelter evolves
export interface Move {
  id: string;
  tenantId: string;
  personId: string;
  fromRoles: string[];
  toRoles: string[];
  date: string;
  trigger?: string; // what caused the move (e.g., "First donation", "Adopted Whiskers", "Signed up for weekend shift")
}

export interface Person {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  roles: string[]; // current active roles: 'donor', 'volunteer', 'adopter'
  moves: Move[];
  tags: string[];
  organizationId?: string; // linked organization
  organizationName?: string;
  createdAt: string;
  updatedAt: string;
  totalDonations: number;
  totalVolunteerHours: number;
  isActive: boolean;
}

// ========== Organization Types ==========

export interface Organization {
  id: string;
  tenantId: string;
  name: string;
  type: 'corporation' | 'foundation' | 'nonprofit' | 'small-business' | 'other';
  ein?: string; // Employer Identification Number for tax purposes
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  memberIds: string[]; // people associated with this org
  roles: string[]; // 'donor', 'volunteer', 'sponsor'
  totalDonations: number;
  totalVolunteerHours: number;
  matchingGiftProgram: boolean;
  matchRatio?: number; // e.g., 1.0 = 1:1 match, 2.0 = 2:1 match
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface TaxLetterRecord {
  id: string;
  tenantId: string;
  recipientType: 'individual' | 'organization';
  recipientId: string;
  recipientName: string;
  ein?: string;
  address: string;
  taxYear: number;
  totalMonetary: number;
  totalInKind: number;
  totalCombined: number;
  donations: Donation[];
  generatedAt: string;
  status: 'draft' | 'generated' | 'sent';
}

export type DonationType = 'monetary' | 'in-kind' | 'time';

export interface Donation {
  id: string;
  tenantId: string;
  personId?: string;
  personName?: string;
  organizationId?: string;
  organizationName?: string;
  type: DonationType;
  amount?: number;
  description: string;
  date: string;
  category: string;
  hours?: number;
  itemDescription?: string;
  estimatedValue?: number;
  receiptIssued: boolean;
  notes?: string;
}

export type AnimalSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
export type AnimalStatus = 'intake' | 'available' | 'adopted' | 'foster' | 'medical-hold' | 'transferred' | 'deceased' | 'euthanized';
export type AnimalGender = 'male' | 'female' | 'unknown';
export type AnimalSize = 'small' | 'medium' | 'large' | 'extra-large';

/** Asilomar Accords intake condition classification */
export type AsilomarCondition = 'healthy' | 'treatable-rehabilitable' | 'treatable-manageable' | 'unhealthy-untreatable';

/** SAC age group classification */
export type SacAgeGroup = 'neonate' | 'weaned' | 'juvenile' | 'adult' | 'senior';

/** Outcome type for SAC reporting */
export type OutcomeType = 'adoption' | 'return-to-owner' | 'transfer-out' | 'euthanasia-owner-request' | 'euthanasia-shelter' | 'died-in-care' | 'missing' | 'other';

export interface Animal {
  id: string;
  tenantId: string;
  animalId: string; // Human-readable ID like "DOG-2024-0042"
  name: string;
  species: AnimalSpecies;
  breed: string;
  color: string;
  gender: AnimalGender;
  size: AnimalSize;
  age?: string;
  dateOfBirth?: string;
  weight?: number;
  microchipId?: string;
  status: AnimalStatus;
  intakeDate: string;
  intakeType: 'stray' | 'surrender' | 'transfer' | 'return' | 'confiscation';
  intakeCondition: AsilomarCondition;
  intakePersonId?: string;
  intakePersonName?: string;
  alteredStatus: 'intact' | 'spayed' | 'neutered' | 'unknown';
  description: string;
  medicalNotes: string[];
  tags: string[];
  photoUrl?: string;
  kennelLocation?: string;
  holdExpirationDate?: string;
  outcomeType?: OutcomeType;
  outcomeDate?: string;
  fosterHomeId?: string;
  createdAt: string;
  updatedAt: string;
}

// ========== Medical Records ==========

export type MedicalRecordType = 'vaccination' | 'surgery' | 'treatment' | 'exam' | 'medication' | 'test';

export interface MedicalRecord {
  id: string;
  tenantId: string;
  animalId: string;
  type: MedicalRecordType;
  description: string;
  date: string;
  veterinarian?: string;
  notes?: string;
  nextDueDate?: string;
  createdAt: string;
}

// ========== Foster Management ==========

export interface FosterHome {
  id: string;
  tenantId: string;
  personId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  capacity: number;
  currentCount: number;
  speciesPreference: AnimalSpecies[];
  sizePreference: AnimalSize[];
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FosterPlacement {
  id: string;
  tenantId: string;
  animalId: string;
  animalName: string;
  fosterHomeId: string;
  fosterName: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'foster-to-adopt';
  notes?: string;
  createdAt: string;
}

// ========== Kennel Management ==========

export interface KennelLocation {
  id: string;
  tenantId: string;
  name: string;
  zone: string;
  species: AnimalSpecies;
  size: AnimalSize;
  isOccupied: boolean;
  currentAnimalId?: string;
  currentAnimalName?: string;
  notes?: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface StructuredNote {
  id: string;
  tenantId: string;
  tagId: string;
  tagLabel: string;
  severity: AlertSeverity;
  date: string;
  addedBy: string;
}

export interface Adopter {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  structuredNotes: StructuredNote[];
  adoptionHistory: Adoption[];
  returnHistory: AnimalReturn[];
  flagged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Adoption {
  id: string;
  tenantId: string;
  animalId: string;
  animalName: string;
  adopterId: string;
  adopterName: string;
  date: string;
  fee: number;
  status: 'completed' | 'pending' | 'returned';
  returnDate?: string;
  returnReason?: string;
}

export interface AnimalReturn {
  id: string;
  tenantId: string;
  adoptionId: string;
  animalId: string;
  animalName: string;
  adopterId: string;
  date: string;
  reasonTagId: string;
  reasonLabel: string;
}

export interface AdminTag {
  id: string;
  tenantId: string;
  label: string;
  category: 'person' | 'animal' | 'adopter' | 'donation' | 'alert';
  severity?: AlertSeverity;
  isActive: boolean;
  createdAt: string;
}

export interface AlertRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  condition: 'return_count_gte' | 'note_severity' | 'custom';
  threshold: number;
  severity: AlertSeverity;
  isActive: boolean;
}

// ========== Dashboard Types ==========

export interface DashboardStats {
  totalPeople: number;
  totalDonors: number;
  totalVolunteers: number;
  totalAnimals: number;
  availableAnimals: number;
  adoptionsThisMonth: number;
  donationsThisMonth: number;
  volunteerHoursThisMonth: number;
  flaggedAdopters: number;
  animalsInFoster: number;
  liveReleaseRate: number;
  averageLengthOfStay: number;
}

// ========== SAC Reporting ==========

export interface SacReportRow {
  species: AnimalSpecies;
  intakeStray: number;
  intakeSurrender: number;
  intakeTransfer: number;
  intakeOther: number;
  intakeTotal: number;
  outcomeAdoption: number;
  outcomeReturnToOwner: number;
  outcomeTransferOut: number;
  outcomeEuthanasia: number;
  outcomeDiedInCare: number;
  outcomeOther: number;
  outcomeTotal: number;
}

export interface AsilomarStats {
  healthyIntake: number;
  treatableRehabIntake: number;
  treatableManageIntake: number;
  unhealthyIntake: number;
  totalIntake: number;
  liveOutcomes: number;
  totalOutcomes: number;
  ownerRequestEuthanasiaUnhealthy: number;
  liveReleaseRate: number;
  saveRate: number;
}
