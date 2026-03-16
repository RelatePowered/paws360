import {
  Person,
  Organization,
  Animal,
  Donation,
  Adopter,
  Adoption,
  AdminTag,
  AlertRule,
  DashboardStats,
  TaxLetterRecord,
  Tenant,
  User,
  MedicalRecord,
  FosterHome,
  FosterPlacement,
  KennelLocation,
} from './types';

// ========== Tenants ==========

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Dickson County Humane Society',
    slug: 'dickson-county-hs',
    address: '410 Eno Rd',
    city: 'Dickson',
    state: 'TN',
    zip: '37055',
    phone: '(615) 446-7867',
    email: 'info@dicksonhumane.org',
    createdAt: '2024-01-01',
    isActive: true,
  },
  {
    id: 'tenant-2',
    name: 'Springfield Humane Society',
    slug: 'springfield-hs',
    address: '500 Animal Shelter Rd',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    phone: '(555) 000-1234',
    email: 'info@springfieldhumane.org',
    createdAt: '2024-06-01',
    isActive: true,
  },
];

// ========== Users ==========

export const mockUsers: User[] = [
  {
    id: 'user-1',
    tenantId: 'tenant-1',
    email: 'admin@dicksonhumane.org',
    firstName: 'Alice',
    lastName: 'Admin',
    role: 'super_admin',
    permissions: {
      dashboard: 'edit', people: 'edit', animals: 'edit', adoptions: 'edit',
      donations: 'edit', organizations: 'edit', reports: 'edit', admin: 'edit',
    },
    isActive: true,
    createdAt: '2024-01-01',
    lastLoginAt: '2024-10-28',
  },
  {
    id: 'user-2',
    tenantId: 'tenant-1',
    email: 'staff@dicksonhumane.org',
    firstName: 'Bob',
    lastName: 'Staff',
    role: 'staff',
    permissions: {
      dashboard: 'view', people: 'view', animals: 'edit', adoptions: 'edit',
      donations: 'view', organizations: 'view', reports: 'view', admin: 'none',
    },
    isActive: true,
    createdAt: '2024-02-15',
    lastLoginAt: '2024-10-27',
  },
  {
    id: 'user-3',
    tenantId: 'tenant-2',
    email: 'admin@springfieldhumane.org',
    firstName: 'Carol',
    lastName: 'Director',
    role: 'admin',
    permissions: {
      dashboard: 'edit', people: 'edit', animals: 'edit', adoptions: 'edit',
      donations: 'edit', organizations: 'edit', reports: 'edit', admin: 'edit',
    },
    isActive: true,
    createdAt: '2024-06-01',
    lastLoginAt: '2024-10-25',
  },
];

// ========== Tags ==========

const T1 = 'tenant-1';

export const mockTags: AdminTag[] = [
  { id: 'tag-1', tenantId: T1, label: 'Repeat Returner', category: 'adopter', severity: 'critical', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-2', tenantId: T1, label: 'Hoarding Concern', category: 'adopter', severity: 'critical', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-3', tenantId: T1, label: 'Behavioral Issues Reported', category: 'adopter', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-4', tenantId: T1, label: 'Inadequate Housing', category: 'adopter', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-5', tenantId: T1, label: 'Excellent Adopter', category: 'adopter', severity: 'info', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-6', tenantId: T1, label: 'Senior', category: 'animal', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-7', tenantId: T1, label: 'Special Needs', category: 'animal', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-8', tenantId: T1, label: 'Good with Kids', category: 'animal', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-9', tenantId: T1, label: 'Major Donor', category: 'person', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-10', tenantId: T1, label: 'Monthly Volunteer', category: 'person', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-11', tenantId: T1, label: 'Pet Food', category: 'donation', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-12', tenantId: T1, label: 'Medical Supplies', category: 'donation', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-13', tenantId: T1, label: 'Animal Not Returned in Good Health', category: 'adopter', severity: 'critical', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-14', tenantId: T1, label: 'Multiple Animals Adopted Quickly', category: 'adopter', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-15', tenantId: T1, label: 'Surrender - Moving', category: 'alert', severity: 'info', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-16', tenantId: T1, label: 'Surrender - Allergies', category: 'alert', severity: 'info', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-17', tenantId: T1, label: 'Surrender - Behavioral', category: 'alert', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
];

// ========== Alert Rules ==========

export const mockAlertRules: AlertRule[] = [
  { id: 'rule-1', tenantId: T1, name: 'Repeat Returner Alert', description: 'Flag adopters who return 2 or more animals', condition: 'return_count_gte', threshold: 2, severity: 'critical', isActive: true },
  { id: 'rule-2', tenantId: T1, name: 'Quick Adoption Pattern', description: 'Flag adopters with 3+ adoptions in 6 months', condition: 'return_count_gte', threshold: 3, severity: 'warning', isActive: true },
];

// ========== People ==========

export const mockPeople: Person[] = [
  {
    id: 'p-1', tenantId: T1, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567',
    address: '123 Oak St', city: 'Dickson', state: 'TN', zip: '37055',
    roles: ['donor', 'volunteer', 'adopter'],
    moves: [
      { id: 'm-1a', tenantId: T1, personId: 'p-1', fromRoles: [], toRoles: ['donor'], date: '2024-01-10', trigger: 'First donation — $500 to General Fund' },
      { id: 'm-1b', tenantId: T1, personId: 'p-1', fromRoles: ['donor'], toRoles: ['donor', 'volunteer'], date: '2024-06-15', trigger: 'Signed up for weekend adoption events' },
      { id: 'm-1c', tenantId: T1, personId: 'p-1', fromRoles: ['donor', 'volunteer'], toRoles: ['donor', 'volunteer', 'adopter'], date: '2024-09-22', trigger: 'Adopted Luna (DOG-2024-0067)' },
    ],
    tags: ['Major Donor', 'Monthly Volunteer'], createdAt: '2024-01-10', updatedAt: '2024-09-22',
    totalDonations: 5200, totalVolunteerHours: 48, isActive: true,
  },
  {
    id: 'p-2', tenantId: T1, firstName: 'Michael', lastName: 'Chen', email: 'mchen@email.com', phone: '(555) 234-5678',
    address: '456 Maple Ave', city: 'Dickson', state: 'TN', zip: '37055',
    roles: ['donor'],
    organizationId: 'org-1', organizationName: 'Chen Technologies',
    moves: [
      { id: 'm-2a', tenantId: T1, personId: 'p-2', fromRoles: [], toRoles: ['donor'], date: '2024-02-20', trigger: 'First donation — $5,000 to Capital Campaign (via Chen Technologies)' },
    ],
    tags: ['Major Donor'], createdAt: '2024-02-20', updatedAt: '2024-02-20',
    totalDonations: 12500, totalVolunteerHours: 0, isActive: true,
  },
  {
    id: 'p-3', tenantId: T1, firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.r@email.com', phone: '(555) 345-6789',
    address: '789 Pine Rd', city: 'Dickson', state: 'TN', zip: '37055',
    roles: ['volunteer'],
    organizationId: 'org-2', organizationName: 'Dickson County Community Bank',
    moves: [
      { id: 'm-3a', tenantId: T1, personId: 'p-3', fromRoles: [], toRoles: ['volunteer'], date: '2024-03-05', trigger: 'Signed up for dog walking shifts' },
      { id: 'm-3b', tenantId: T1, personId: 'p-3', fromRoles: ['volunteer'], toRoles: ['volunteer', 'donor'], date: '2024-05-10', trigger: 'First donation — $350 after 2 months volunteering' },
      { id: 'm-3c', tenantId: T1, personId: 'p-3', fromRoles: ['volunteer', 'donor'], toRoles: ['volunteer'], date: '2024-08-01', trigger: 'Donor role lapsed — no donations in 90 days' },
    ],
    tags: ['Monthly Volunteer'], createdAt: '2024-03-05', updatedAt: '2024-08-01',
    totalDonations: 350, totalVolunteerHours: 120, isActive: true,
  },
  {
    id: 'p-4', tenantId: T1, firstName: 'James', lastName: 'Williams', email: 'jwilliams@email.com', phone: '(555) 456-7890',
    roles: ['donor'],
    moves: [
      { id: 'm-4a', tenantId: T1, personId: 'p-4', fromRoles: [], toRoles: ['donor'], date: '2024-04-12', trigger: 'In-kind donation — 50 lbs dog food' },
    ],
    tags: [], createdAt: '2024-04-12', updatedAt: '2024-04-12',
    totalDonations: 800, totalVolunteerHours: 0, isActive: true,
  },
  {
    id: 'p-5', tenantId: T1, firstName: 'Lisa', lastName: 'Park', email: 'lpark@email.com', phone: '(555) 567-8901',
    roles: ['volunteer', 'adopter'],
    moves: [
      { id: 'm-5a', tenantId: T1, personId: 'p-5', fromRoles: [], toRoles: ['volunteer'], date: '2024-05-22', trigger: 'Signed up for front desk shifts' },
      { id: 'm-5b', tenantId: T1, personId: 'p-5', fromRoles: ['volunteer'], toRoles: ['volunteer', 'adopter'], date: '2024-08-15', trigger: 'Adopted Whiskers (CAT-2024-0108)' },
    ],
    tags: ['Monthly Volunteer'], createdAt: '2024-05-22', updatedAt: '2024-08-15',
    totalDonations: 0, totalVolunteerHours: 64, isActive: true,
  },
];

// ========== Animals ==========

export const mockAnimals: Animal[] = [
  {
    id: 'a-1', tenantId: T1, animalId: 'DOG-2024-0042', name: 'Buddy', species: 'dog', breed: 'Golden Retriever',
    color: 'Golden', gender: 'male', size: 'large', age: '3 years', dateOfBirth: '2021-06-15', weight: 65,
    microchipId: 'MC-98765', status: 'available', intakeDate: '2024-09-01', intakeType: 'surrender',
    intakeCondition: 'healthy', alteredStatus: 'neutered',
    intakePersonId: 'p-4', intakePersonName: 'James Williams',
    description: 'Friendly, well-socialized golden retriever. Good with kids and other dogs.',
    medicalNotes: ['Vaccinations up to date', 'Neutered'], tags: ['Good with Kids'],
    kennelLocation: 'D-101', createdAt: '2024-09-01', updatedAt: '2024-09-01',
  },
  {
    id: 'a-2', tenantId: T1, animalId: 'CAT-2024-0108', name: 'Whiskers', species: 'cat', breed: 'Domestic Shorthair',
    color: 'Tabby', gender: 'female', size: 'small', age: '5 years', dateOfBirth: '2019-03-20', weight: 9,
    status: 'adopted', intakeDate: '2024-07-15', intakeType: 'stray',
    intakeCondition: 'healthy', alteredStatus: 'spayed',
    outcomeType: 'adoption', outcomeDate: '2024-10-01',
    description: 'Calm and affectionate. Loves lap time. Indoor only recommended.',
    medicalNotes: ['Spayed', 'FIV negative', 'FeLV negative'], tags: ['Senior'],
    createdAt: '2024-07-15', updatedAt: '2024-10-01',
  },
  {
    id: 'a-3', tenantId: T1, animalId: 'DOG-2024-0067', name: 'Luna', species: 'dog', breed: 'Labrador Mix',
    color: 'Black', gender: 'female', size: 'medium', age: '1 year', dateOfBirth: '2023-10-01', weight: 45,
    status: 'available', intakeDate: '2024-10-05', intakeType: 'transfer',
    intakeCondition: 'healthy', alteredStatus: 'spayed',
    description: 'Energetic young lab mix. Needs an active family. Basic obedience trained.',
    medicalNotes: ['Vaccinations up to date', 'Spayed', 'Heartworm negative'], tags: [],
    kennelLocation: 'D-103', createdAt: '2024-10-05', updatedAt: '2024-10-05',
  },
  {
    id: 'a-4', tenantId: T1, animalId: 'CAT-2024-0115', name: 'Oliver', species: 'cat', breed: 'Siamese Mix',
    color: 'Cream/Brown', gender: 'male', size: 'medium', age: '2 years', dateOfBirth: '2022-05-10', weight: 11,
    status: 'medical-hold', intakeDate: '2024-10-10', intakeType: 'confiscation',
    intakeCondition: 'treatable-rehabilitable', alteredStatus: 'neutered',
    holdExpirationDate: '2024-10-20',
    description: 'Shy but warming up. Needs a quiet home. May have dental issues.',
    medicalNotes: ['Needs dental evaluation', 'Neutered', 'Underweight - on feeding plan'],
    tags: ['Special Needs'], kennelLocation: 'C-205',
    createdAt: '2024-10-10', updatedAt: '2024-10-10',
  },
  {
    id: 'a-5', tenantId: T1, animalId: 'DOG-2024-0089', name: 'Max', species: 'dog', breed: 'German Shepherd',
    color: 'Black/Tan', gender: 'male', size: 'large', age: '4 years', dateOfBirth: '2020-08-12', weight: 80,
    status: 'foster', intakeDate: '2024-08-20', intakeType: 'surrender',
    intakeCondition: 'treatable-manageable', alteredStatus: 'neutered',
    fosterHomeId: 'fh-1',
    description: 'Loyal and protective. Best as only pet. Experienced owner preferred.',
    medicalNotes: ['Vaccinations up to date', 'Neutered', 'Hip dysplasia - managed'],
    tags: ['Special Needs'], createdAt: '2024-08-20', updatedAt: '2024-09-15',
  },
  {
    id: 'a-6', tenantId: T1, animalId: 'DOG-2024-0095', name: 'Rosie', species: 'dog', breed: 'Beagle',
    color: 'Tri-color', gender: 'female', size: 'medium', age: '6 years', dateOfBirth: '2018-02-14', weight: 28,
    status: 'euthanized', intakeDate: '2024-06-01', intakeType: 'stray',
    intakeCondition: 'unhealthy-untreatable', alteredStatus: 'spayed',
    outcomeType: 'euthanasia-shelter', outcomeDate: '2024-06-05',
    description: 'Found as stray in severe condition. Aggressive bone cancer.',
    medicalNotes: ['Severe osteosarcoma', 'Compassionate euthanasia recommended'],
    tags: [], createdAt: '2024-06-01', updatedAt: '2024-06-05',
  },
  {
    id: 'a-7', tenantId: T1, animalId: 'CAT-2024-0120', name: 'Mittens', species: 'cat', breed: 'Maine Coon Mix',
    color: 'Orange Tabby', gender: 'female', size: 'medium', age: '3 years', dateOfBirth: '2021-11-30', weight: 12,
    status: 'adopted', intakeDate: '2024-08-10', intakeType: 'surrender',
    intakeCondition: 'healthy', alteredStatus: 'spayed',
    outcomeType: 'adoption', outcomeDate: '2024-09-15',
    description: 'Playful and social. Gets along with other cats. Loves window perches.',
    medicalNotes: ['Vaccinations up to date', 'Spayed'],
    tags: ['Good with Kids'], createdAt: '2024-08-10', updatedAt: '2024-09-15',
  },
  {
    id: 'a-8', tenantId: T1, animalId: 'DOG-2024-0101', name: 'Cooper', species: 'dog', breed: 'Pit Bull Mix',
    color: 'Brindle', gender: 'male', size: 'large', age: '2 years', dateOfBirth: '2022-04-20', weight: 60,
    status: 'intake', intakeDate: '2024-10-28', intakeType: 'stray',
    intakeCondition: 'healthy', alteredStatus: 'intact',
    holdExpirationDate: '2024-11-01',
    description: 'Found wandering near Highway 46. Friendly, no collar. Scanning for microchip.',
    medicalNotes: ['Intake exam pending'],
    tags: [], kennelLocation: 'D-105',
    createdAt: '2024-10-28', updatedAt: '2024-10-28',
  },
];

// ========== Organizations ==========

export const mockOrganizations: Organization[] = [
  {
    id: 'org-1', tenantId: T1, name: 'Chen Technologies', type: 'corporation',
    ein: '36-1234567', contactName: 'Michael Chen', contactEmail: 'mchen@chentech.com', contactPhone: '(555) 234-5678',
    address: '100 Tech Parkway', city: 'Dickson', state: 'TN', zip: '37055',
    memberIds: ['p-2'], roles: ['donor', 'sponsor'],
    totalDonations: 25000, totalVolunteerHours: 0,
    matchingGiftProgram: true, matchRatio: 1.0,
    tags: ['Major Donor', 'Corporate Sponsor'], createdAt: '2024-02-15', updatedAt: '2024-10-20', isActive: true,
  },
  {
    id: 'org-2', tenantId: T1, name: 'Dickson County Community Bank', type: 'corporation',
    ein: '36-9876543', contactName: 'David Park', contactEmail: 'dpark@scbank.com', contactPhone: '(555) 444-5555',
    address: '200 Main St', city: 'Dickson', state: 'TN', zip: '37055',
    memberIds: ['p-3'], roles: ['donor', 'volunteer'],
    totalDonations: 10000, totalVolunteerHours: 80,
    matchingGiftProgram: true, matchRatio: 0.5,
    tags: ['Corporate Volunteer'], createdAt: '2024-01-05', updatedAt: '2024-10-15', isActive: true,
  },
  {
    id: 'org-3', tenantId: T1, name: 'Paws & Claws Pet Supply', type: 'small-business',
    ein: '36-5555555', contactName: 'Karen Wright', contactEmail: 'karen@pawsclaws.com', contactPhone: '(555) 666-7777',
    address: '50 Commerce Dr', city: 'Dickson', state: 'TN', zip: '37055',
    memberIds: [], roles: ['donor'],
    totalDonations: 3200, totalVolunteerHours: 0,
    matchingGiftProgram: false,
    tags: [], createdAt: '2024-03-20', updatedAt: '2024-09-30', isActive: true,
  },
  {
    id: 'org-4', tenantId: T1, name: 'Heart of Tennessee Foundation', type: 'foundation',
    ein: '36-7777777', contactName: 'Robert Hall', contactEmail: 'rhall@hoif.org', contactPhone: '(555) 888-9999',
    address: '300 Philanthropy Ln', city: 'Dickson', state: 'TN', zip: '37055',
    memberIds: [], roles: ['donor'],
    totalDonations: 50000, totalVolunteerHours: 0,
    matchingGiftProgram: false,
    tags: ['Major Donor', 'Grant Funder'], createdAt: '2024-01-15', updatedAt: '2024-07-01', isActive: true,
  },
];

// ========== Donations ==========

export const mockDonations: Donation[] = [
  { id: 'd-1', tenantId: T1, personId: 'p-1', personName: 'Sarah Johnson', type: 'monetary', amount: 2500, description: 'Annual fund donation', date: '2024-10-01', category: 'General Fund', receiptIssued: true },
  { id: 'd-2', tenantId: T1, personId: 'p-2', personName: 'Michael Chen', organizationId: 'org-1', organizationName: 'Chen Technologies', type: 'monetary', amount: 5000, description: 'Building renovation fund', date: '2024-10-05', category: 'Capital Campaign', receiptIssued: true },
  { id: 'd-3', tenantId: T1, personId: 'p-1', personName: 'Sarah Johnson', type: 'time', hours: 8, description: 'Weekend adoption event', date: '2024-10-12', category: 'Events', receiptIssued: false },
  { id: 'd-4', tenantId: T1, personId: 'p-3', personName: 'Emily Rodriguez', organizationId: 'org-2', organizationName: 'Dickson County Community Bank', type: 'time', hours: 16, description: 'Dog walking and socialization', date: '2024-10-15', category: 'Animal Care', receiptIssued: false },
  { id: 'd-5', tenantId: T1, personId: 'p-4', personName: 'James Williams', type: 'in-kind', itemDescription: '50 lbs premium dog food', estimatedValue: 120, description: 'Pet food donation', date: '2024-10-18', category: 'Supplies', receiptIssued: true },
  { id: 'd-6', tenantId: T1, organizationId: 'org-1', organizationName: 'Chen Technologies', type: 'monetary', amount: 7500, description: 'Corporate matching gift — year end', date: '2024-10-20', category: 'General Fund', receiptIssued: true },
  { id: 'd-7', tenantId: T1, personId: 'p-5', personName: 'Lisa Park', type: 'time', hours: 24, description: 'Front desk and phone support', date: '2024-10-22', category: 'Administration', receiptIssued: false },
  { id: 'd-8', tenantId: T1, personId: 'p-1', personName: 'Sarah Johnson', type: 'in-kind', itemDescription: 'Blankets and towels (20 items)', estimatedValue: 200, description: 'Comfort supplies', date: '2024-10-25', category: 'Supplies', receiptIssued: true },
  { id: 'd-9', tenantId: T1, organizationId: 'org-3', organizationName: 'Paws & Claws Pet Supply', type: 'in-kind', itemDescription: 'Pet food and toys (bulk)', estimatedValue: 1800, description: 'Quarterly supply donation', date: '2024-10-28', category: 'Supplies', receiptIssued: true },
  { id: 'd-10', tenantId: T1, organizationId: 'org-4', organizationName: 'Heart of Tennessee Foundation', type: 'monetary', amount: 25000, description: 'Annual operating grant', date: '2024-07-01', category: 'General Fund', receiptIssued: true },
  { id: 'd-11', tenantId: T1, organizationId: 'org-2', organizationName: 'Dickson County Community Bank', type: 'monetary', amount: 10000, description: 'Shelter renovation sponsorship', date: '2024-09-15', category: 'Capital Campaign', receiptIssued: true },
];

// ========== Adopters ==========

export const mockAdopters: Adopter[] = [
  {
    id: 'ad-1', tenantId: T1, firstName: 'Rachel', lastName: 'Green', email: 'rgreen@email.com', phone: '(555) 678-9012',
    address: '100 Church St', city: 'Dickson', state: 'TN', zip: '37055',
    structuredNotes: [
      { id: 'sn-1', tenantId: T1, tagId: 'tag-5', tagLabel: 'Excellent Adopter', severity: 'info', date: '2024-08-01', addedBy: 'Admin' },
    ],
    adoptionHistory: [], returnHistory: [], flagged: false,
    createdAt: '2024-06-01', updatedAt: '2024-08-01',
  },
  {
    id: 'ad-2', tenantId: T1, firstName: 'Tom', lastName: 'Baker', email: 'tbaker@email.com', phone: '(555) 789-0123',
    address: '200 Elm St', city: 'Dickson', state: 'TN', zip: '37055',
    structuredNotes: [
      { id: 'sn-2', tenantId: T1, tagId: 'tag-1', tagLabel: 'Repeat Returner', severity: 'critical', date: '2024-09-20', addedBy: 'Admin' },
      { id: 'sn-3', tenantId: T1, tagId: 'tag-3', tagLabel: 'Behavioral Issues Reported', severity: 'warning', date: '2024-09-20', addedBy: 'Admin' },
    ],
    adoptionHistory: [], returnHistory: [
      { id: 'ret-1', tenantId: T1, adoptionId: 'adp-old-1', animalId: 'a-old-1', animalName: 'Rocky', adopterId: 'ad-2', date: '2024-05-15', reasonTagId: 'tag-17', reasonLabel: 'Surrender - Behavioral' },
      { id: 'ret-2', tenantId: T1, adoptionId: 'adp-old-2', animalId: 'a-old-2', animalName: 'Daisy', adopterId: 'ad-2', date: '2024-09-10', reasonTagId: 'tag-17', reasonLabel: 'Surrender - Behavioral' },
    ],
    flagged: true,
    createdAt: '2024-03-15', updatedAt: '2024-09-20',
  },
  {
    id: 'ad-3', tenantId: T1, firstName: 'Nancy', lastName: 'Drew', email: 'ndrew@email.com', phone: '(555) 890-1234',
    structuredNotes: [
      { id: 'sn-4', tenantId: T1, tagId: 'tag-14', tagLabel: 'Multiple Animals Adopted Quickly', severity: 'warning', date: '2024-10-01', addedBy: 'System' },
    ],
    adoptionHistory: [], returnHistory: [],
    flagged: false,
    createdAt: '2024-07-20', updatedAt: '2024-10-01',
  },
];

// ========== Adoptions ==========

export const mockAdoptions: Adoption[] = [
  { id: 'adp-1', tenantId: T1, animalId: 'a-2', animalName: 'Whiskers', adopterId: 'ad-1', adopterName: 'Rachel Green', date: '2024-10-01', fee: 75, status: 'completed' },
  { id: 'adp-2', tenantId: T1, animalId: 'a-old-1', animalName: 'Rocky', adopterId: 'ad-2', adopterName: 'Tom Baker', date: '2024-03-20', fee: 150, status: 'returned', returnDate: '2024-05-15', returnReason: 'Surrender - Behavioral' },
  { id: 'adp-3', tenantId: T1, animalId: 'a-old-2', animalName: 'Daisy', adopterId: 'ad-2', adopterName: 'Tom Baker', date: '2024-07-01', fee: 100, status: 'returned', returnDate: '2024-09-10', returnReason: 'Surrender - Behavioral' },
];

// ========== Dashboard Stats ==========

export const mockDashboardStats: DashboardStats = {
  totalPeople: 5,
  totalDonors: 3,
  totalVolunteers: 3,
  totalAnimals: 8,
  availableAnimals: 2,
  adoptionsThisMonth: 1,
  donationsThisMonth: 15320,
  volunteerHoursThisMonth: 48,
  flaggedAdopters: 1,
  animalsInFoster: 1,
  liveReleaseRate: 85.7,
  averageLengthOfStay: 24,
};

// ========== Medical Records ==========

export const mockMedicalRecords: MedicalRecord[] = [
  { id: 'mr-1', tenantId: T1, animalId: 'a-1', type: 'vaccination', description: 'DHPP Booster', date: '2024-09-01', veterinarian: 'Dr. Sarah Martinez', nextDueDate: '2025-09-01', createdAt: '2024-09-01' },
  { id: 'mr-2', tenantId: T1, animalId: 'a-1', type: 'vaccination', description: 'Rabies Vaccination', date: '2024-09-01', veterinarian: 'Dr. Sarah Martinez', nextDueDate: '2025-09-01', createdAt: '2024-09-01' },
  { id: 'mr-3', tenantId: T1, animalId: 'a-1', type: 'surgery', description: 'Neuter Surgery', date: '2024-09-05', veterinarian: 'Dr. Sarah Martinez', notes: 'Routine, no complications', createdAt: '2024-09-05' },
  { id: 'mr-4', tenantId: T1, animalId: 'a-2', type: 'vaccination', description: 'FVRCP', date: '2024-07-16', veterinarian: 'Dr. James Wilson', nextDueDate: '2025-07-16', createdAt: '2024-07-16' },
  { id: 'mr-5', tenantId: T1, animalId: 'a-2', type: 'test', description: 'FIV/FeLV Test - Negative', date: '2024-07-16', veterinarian: 'Dr. James Wilson', createdAt: '2024-07-16' },
  { id: 'mr-6', tenantId: T1, animalId: 'a-3', type: 'vaccination', description: 'DHPP + Bordetella', date: '2024-10-05', veterinarian: 'Dr. Sarah Martinez', nextDueDate: '2025-10-05', createdAt: '2024-10-05' },
  { id: 'mr-7', tenantId: T1, animalId: 'a-3', type: 'test', description: 'Heartworm Test - Negative', date: '2024-10-05', veterinarian: 'Dr. Sarah Martinez', createdAt: '2024-10-05' },
  { id: 'mr-8', tenantId: T1, animalId: 'a-4', type: 'exam', description: 'Intake Examination', date: '2024-10-10', veterinarian: 'Dr. James Wilson', notes: 'Underweight, dental issues noted. Start feeding plan.', createdAt: '2024-10-10' },
  { id: 'mr-9', tenantId: T1, animalId: 'a-4', type: 'treatment', description: 'Deworming Treatment', date: '2024-10-10', veterinarian: 'Dr. James Wilson', createdAt: '2024-10-10' },
  { id: 'mr-10', tenantId: T1, animalId: 'a-5', type: 'exam', description: 'Hip Dysplasia Assessment', date: '2024-08-22', veterinarian: 'Dr. Sarah Martinez', notes: 'Moderate bilateral hip dysplasia. Manage with joint supplements and controlled exercise.', createdAt: '2024-08-22' },
  { id: 'mr-11', tenantId: T1, animalId: 'a-5', type: 'medication', description: 'Glucosamine/Chondroitin Joint Supplement', date: '2024-08-22', veterinarian: 'Dr. Sarah Martinez', notes: 'Daily — continue indefinitely', createdAt: '2024-08-22' },
  { id: 'mr-12', tenantId: T1, animalId: 'a-8', type: 'exam', description: 'Intake Examination', date: '2024-10-28', veterinarian: 'Dr. James Wilson', notes: 'Healthy, good body condition. No microchip found.', createdAt: '2024-10-28' },
];

// ========== Foster Homes ==========

export const mockFosterHomes: FosterHome[] = [
  {
    id: 'fh-1', tenantId: T1, personId: 'p-1', firstName: 'Sarah', lastName: 'Johnson',
    email: 'sarah.j@email.com', phone: '(555) 123-4567',
    address: '123 Oak St', city: 'Dickson', state: 'TN', zip: '37055',
    capacity: 2, currentCount: 1,
    speciesPreference: ['dog'], sizePreference: ['medium', 'large'],
    isActive: true, notes: 'Has fenced yard. Experienced with large breeds.',
    createdAt: '2024-06-01', updatedAt: '2024-09-15',
  },
  {
    id: 'fh-2', tenantId: T1, firstName: 'Maria', lastName: 'Garcia',
    email: 'mgarcia@email.com', phone: '(555) 222-3333',
    address: '800 Elm St', city: 'Dickson', state: 'TN', zip: '37055',
    capacity: 3, currentCount: 0,
    speciesPreference: ['cat', 'dog'], sizePreference: ['small', 'medium'],
    isActive: true, notes: 'Has experience with kittens and bottle-feeding neonates.',
    createdAt: '2024-04-10', updatedAt: '2024-10-01',
  },
  {
    id: 'fh-3', tenantId: T1, firstName: 'David', lastName: 'Thompson',
    email: 'dthompson@email.com', phone: '(555) 444-5555',
    address: '550 Walnut Dr', city: 'Dickson', state: 'TN', zip: '37055',
    capacity: 1, currentCount: 0,
    speciesPreference: ['dog'], sizePreference: ['small', 'medium'],
    isActive: true, notes: 'Apartment, no yard. Good for calm dogs.',
    createdAt: '2024-07-20', updatedAt: '2024-07-20',
  },
];

// ========== Foster Placements ==========

export const mockFosterPlacements: FosterPlacement[] = [
  {
    id: 'fp-1', tenantId: T1, animalId: 'a-5', animalName: 'Max',
    fosterHomeId: 'fh-1', fosterName: 'Sarah Johnson',
    startDate: '2024-09-15', status: 'active',
    notes: 'Max is doing well with daily joint supplement regimen.',
    createdAt: '2024-09-15',
  },
  {
    id: 'fp-2', tenantId: T1, animalId: 'a-7', animalName: 'Mittens',
    fosterHomeId: 'fh-2', fosterName: 'Maria Garcia',
    startDate: '2024-08-15', endDate: '2024-09-10', status: 'completed',
    notes: 'Mittens socialized well. Ready for adoption.',
    createdAt: '2024-08-15',
  },
];

// ========== Kennel Locations ==========

export const mockKennelLocations: KennelLocation[] = [
  // Dog Zone
  { id: 'k-1', tenantId: T1, name: 'D-101', zone: 'Dog Wing A', species: 'dog', size: 'large', isOccupied: true, currentAnimalId: 'a-1', currentAnimalName: 'Buddy' },
  { id: 'k-2', tenantId: T1, name: 'D-102', zone: 'Dog Wing A', species: 'dog', size: 'large', isOccupied: false },
  { id: 'k-3', tenantId: T1, name: 'D-103', zone: 'Dog Wing A', species: 'dog', size: 'medium', isOccupied: true, currentAnimalId: 'a-3', currentAnimalName: 'Luna' },
  { id: 'k-4', tenantId: T1, name: 'D-104', zone: 'Dog Wing A', species: 'dog', size: 'medium', isOccupied: false },
  { id: 'k-5', tenantId: T1, name: 'D-105', zone: 'Dog Wing B', species: 'dog', size: 'large', isOccupied: true, currentAnimalId: 'a-8', currentAnimalName: 'Cooper' },
  { id: 'k-6', tenantId: T1, name: 'D-106', zone: 'Dog Wing B', species: 'dog', size: 'large', isOccupied: false },
  { id: 'k-7', tenantId: T1, name: 'D-107', zone: 'Dog Wing B', species: 'dog', size: 'small', isOccupied: false },
  { id: 'k-8', tenantId: T1, name: 'D-108', zone: 'Dog Wing B', species: 'dog', size: 'small', isOccupied: false },
  // Cat Zone
  { id: 'k-9', tenantId: T1, name: 'C-201', zone: 'Cat Room', species: 'cat', size: 'small', isOccupied: false },
  { id: 'k-10', tenantId: T1, name: 'C-202', zone: 'Cat Room', species: 'cat', size: 'small', isOccupied: false },
  { id: 'k-11', tenantId: T1, name: 'C-203', zone: 'Cat Room', species: 'cat', size: 'medium', isOccupied: false },
  { id: 'k-12', tenantId: T1, name: 'C-204', zone: 'Cat Room', species: 'cat', size: 'medium', isOccupied: false },
  { id: 'k-13', tenantId: T1, name: 'C-205', zone: 'Cat Isolation', species: 'cat', size: 'medium', isOccupied: true, currentAnimalId: 'a-4', currentAnimalName: 'Oliver', notes: 'Medical hold — dental eval pending' },
  { id: 'k-14', tenantId: T1, name: 'C-206', zone: 'Cat Isolation', species: 'cat', size: 'small', isOccupied: false },
];

// Helper to build tax letter records from donations (legacy — prefer buildTenantTaxLetters in tenant-data.ts)
export function buildTaxLetters(year: number): TaxLetterRecord[] {
  const letters: TaxLetterRecord[] = [];

  const peopleWithDonations = mockPeople.filter(p =>
    mockDonations.some(d => d.personId === p.id && !d.organizationId && new Date(d.date).getFullYear() === year && (d.type === 'monetary' || d.type === 'in-kind'))
  );
  for (const person of peopleWithDonations) {
    const donations = mockDonations.filter(d => d.personId === person.id && !d.organizationId && new Date(d.date).getFullYear() === year && (d.type === 'monetary' || d.type === 'in-kind'));
    const totalMonetary = donations.filter(d => d.type === 'monetary').reduce((s, d) => s + (d.amount || 0), 0);
    const totalInKind = donations.filter(d => d.type === 'in-kind').reduce((s, d) => s + (d.estimatedValue || 0), 0);
    letters.push({
      id: `tl-ind-${person.id}-${year}`,
      tenantId: person.tenantId,
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

  for (const org of mockOrganizations) {
    const donations = mockDonations.filter(d => d.organizationId === org.id && new Date(d.date).getFullYear() === year && (d.type === 'monetary' || d.type === 'in-kind'));
    if (donations.length === 0) continue;
    const totalMonetary = donations.filter(d => d.type === 'monetary').reduce((s, d) => s + (d.amount || 0), 0);
    const totalInKind = donations.filter(d => d.type === 'in-kind').reduce((s, d) => s + (d.estimatedValue || 0), 0);
    letters.push({
      id: `tl-org-${org.id}-${year}`,
      tenantId: org.tenantId,
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
