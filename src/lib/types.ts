// ========== Core Types ==========

export type PersonRole = 'donor' | 'volunteer' | 'adopter' | 'donor-volunteer' | 'donor-adopter' | 'volunteer-adopter' | 'all';

// Moves Management: tracks how a person's relationship with the shelter evolves
export interface Move {
  id: string;
  personId: string;
  fromRoles: string[];
  toRoles: string[];
  date: string;
  trigger?: string; // what caused the move (e.g., "First donation", "Adopted Whiskers", "Signed up for weekend shift")
}

export interface Person {
  id: string;
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
export type AnimalStatus = 'intake' | 'available' | 'adopted' | 'foster' | 'medical-hold' | 'transferred' | 'deceased';
export type AnimalGender = 'male' | 'female' | 'unknown';
export type AnimalSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface Animal {
  id: string;
  animalId: string; // Human-readable ID like "DOG-2024-0042"
  name: string;
  species: AnimalSpecies;
  breed: string;
  color: string;
  gender: AnimalGender;
  size: AnimalSize;
  age?: string;
  weight?: number;
  microchipId?: string;
  status: AnimalStatus;
  intakeDate: string;
  intakeType: 'stray' | 'surrender' | 'transfer' | 'return' | 'confiscation';
  intakePersonId?: string;
  intakePersonName?: string;
  description: string;
  medicalNotes: string[];
  tags: string[];
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface StructuredNote {
  id: string;
  tagId: string;
  tagLabel: string;
  severity: AlertSeverity;
  date: string;
  addedBy: string;
}

export interface Adopter {
  id: string;
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
  label: string;
  category: 'person' | 'animal' | 'adopter' | 'donation' | 'alert';
  severity?: AlertSeverity;
  isActive: boolean;
  createdAt: string;
}

export interface AlertRule {
  id: string;
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
}
