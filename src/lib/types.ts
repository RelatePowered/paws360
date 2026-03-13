// ========== Core Types ==========

export type PersonRole = 'donor' | 'volunteer' | 'both';

export interface RoleTransition {
  id: string;
  personId: string;
  fromRole: PersonRole;
  toRole: PersonRole;
  date: string;
  note?: string;
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
  role: PersonRole;
  roleHistory: RoleTransition[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  totalDonations: number;
  totalVolunteerHours: number;
  isActive: boolean;
}

export type DonationType = 'monetary' | 'in-kind' | 'time';

export interface Donation {
  id: string;
  personId: string;
  personName: string;
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
  recentRoleTransitions: RoleTransition[];
  flaggedAdopters: number;
}
