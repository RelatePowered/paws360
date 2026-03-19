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
  AdoptionApplication,
} from './types';

// ========== Tenants ==========

export const mockTenants: Tenant[] = [
  {
    id: 'eae04d4f-c772-45f4-9a88-c34e2d590ceb',
    name: 'Dickson County Humane Society',
    slug: 'dickson-county-hs',
    plan: 'professional',
    address: '410 Eno Rd',
    city: 'Dickson',
    state: 'TN',
    zip: '37055',
    phone: '(615) 446-7867',
    email: 'info@dicksonhumane.org',
    website: 'www.dicksonhumane.org',
    logoUrl: '/placeholder-logo.svg',
    ein: '62-1234567',
    createdAt: '2024-01-01',
    isActive: true,
  },
  {
    id: '47da426a-09f3-4024-bc52-837550902ad3',
    name: 'Springfield Humane Society',
    slug: 'springfield-hs',
    plan: 'starter',
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
    id: '9e8f25f6-94ab-4938-ad13-9399babbbc0d',
    tenantId: 'eae04d4f-c772-45f4-9a88-c34e2d590ceb',
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
    id: '2e692b1a-b797-4b70-b8b9-9f90464f08b3',
    tenantId: 'eae04d4f-c772-45f4-9a88-c34e2d590ceb',
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
    id: '48210a06-e768-4293-be84-37f6e6710279',
    tenantId: '47da426a-09f3-4024-bc52-837550902ad3',
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

const T1 = 'eae04d4f-c772-45f4-9a88-c34e2d590ceb';

export const mockTags: AdminTag[] = [
  { id: '95d1d020-cad5-4bb0-b630-426a586ec767', tenantId: T1, label: 'Repeat Returner', category: 'adopter', severity: 'critical', isActive: true, createdAt: '2024-01-01' },
  { id: 'f27fbe36-fc4e-4733-94ac-0dfa149b949b', tenantId: T1, label: 'Hoarding Concern', category: 'adopter', severity: 'critical', isActive: true, createdAt: '2024-01-01' },
  { id: 'c9185168-4ddd-4b7a-8553-b7ceb3632ce3', tenantId: T1, label: 'Behavioral Issues Reported', category: 'adopter', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
  { id: 'e0c22dca-7cdd-4120-b2fd-ecfb8fff8050', tenantId: T1, label: 'Inadequate Housing', category: 'adopter', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
  { id: '44922480-c4d8-4db4-b729-1055c7d7871c', tenantId: T1, label: 'Excellent Adopter', category: 'adopter', severity: 'info', isActive: true, createdAt: '2024-01-01' },
  { id: '912ac56c-16be-4dee-b97a-9c5bf1967649', tenantId: T1, label: 'Senior', category: 'animal', isActive: true, createdAt: '2024-01-01' },
  { id: '1c1fff82-36aa-407b-b2a4-27f7bb05d7a2', tenantId: T1, label: 'Special Needs', category: 'animal', isActive: true, createdAt: '2024-01-01' },
  { id: 'ae85f9b7-3dfc-4c37-b287-fdda5de5ea15', tenantId: T1, label: 'Good with Kids', category: 'animal', isActive: true, createdAt: '2024-01-01' },
  { id: '754c5bda-a390-401a-8283-f80ffc8ebb66', tenantId: T1, label: 'Major Donor', category: 'person', isActive: true, createdAt: '2024-01-01' },
  { id: 'd5a88c26-7a91-4a24-8298-1bc7db0f9459', tenantId: T1, label: 'Monthly Volunteer', category: 'person', isActive: true, createdAt: '2024-01-01' },
  { id: '28162161-3931-414b-bb59-e032328fa2ba', tenantId: T1, label: 'Pet Food', category: 'donation', isActive: true, createdAt: '2024-01-01' },
  { id: '3f2f1075-c10f-4fb4-a652-51454dfbf82c', tenantId: T1, label: 'Medical Supplies', category: 'donation', isActive: true, createdAt: '2024-01-01' },
  { id: 'd1a094ae-9b4e-4114-a3e3-e52bd531ae71', tenantId: T1, label: 'Animal Not Returned in Good Health', category: 'adopter', severity: 'critical', isActive: true, createdAt: '2024-01-01' },
  { id: '916467e1-b906-4d8b-99a3-ac4753b627e9', tenantId: T1, label: 'Multiple Animals Adopted Quickly', category: 'adopter', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
  { id: 'e5253b80-3b46-4892-b8a1-b1d02e6511c9', tenantId: T1, label: 'Surrender - Moving', category: 'alert', severity: 'info', isActive: true, createdAt: '2024-01-01' },
  { id: '5d9490ad-4a02-49f7-a80f-76b978056c21', tenantId: T1, label: 'Surrender - Allergies', category: 'alert', severity: 'info', isActive: true, createdAt: '2024-01-01' },
  { id: '630f94f4-40fa-4bd6-bb31-f1693ea40092', tenantId: T1, label: 'Surrender - Behavioral', category: 'alert', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
];

// ========== Alert Rules ==========

export const mockAlertRules: AlertRule[] = [
  { id: 'dfa2f0c8-9117-47c5-b523-f02d9cb9d554', tenantId: T1, name: 'Repeat Returner Alert', description: 'Flag adopters who return 2 or more animals', condition: 'return_count_gte', threshold: 2, severity: 'critical', isActive: true },
  { id: '1a39e54b-93fa-4c2d-9e81-74ea7bb30b85', tenantId: T1, name: 'Quick Adoption Pattern', description: 'Flag adopters with 3+ adoptions in 6 months', condition: 'return_count_gte', threshold: 3, severity: 'warning', isActive: true },
];

// ========== People ==========

export const mockPeople: Person[] = [
  {
    id: '01043c9b-e4f2-4183-8c65-37c092130416', tenantId: T1, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567',
    address: '123 Oak St', city: 'Dickson', state: 'TN', zip: '37055',
    roles: ['donor', 'volunteer', 'adopter'],
    moves: [
      { id: 'afe430ce-94a1-4e31-863e-124fab481f01', tenantId: T1, personId: '01043c9b-e4f2-4183-8c65-37c092130416', fromRoles: [], toRoles: ['donor'], date: '2024-01-10', trigger: 'First donation — $500 to General Fund' },
      { id: '958ea50a-852c-4f86-a353-a7202b3bf384', tenantId: T1, personId: '01043c9b-e4f2-4183-8c65-37c092130416', fromRoles: ['donor'], toRoles: ['donor', 'volunteer'], date: '2024-06-15', trigger: 'Signed up for weekend adoption events' },
      { id: 'de7c8330-70d8-406c-aa36-d3ee576a34e6', tenantId: T1, personId: '01043c9b-e4f2-4183-8c65-37c092130416', fromRoles: ['donor', 'volunteer'], toRoles: ['donor', 'volunteer', 'adopter'], date: '2024-09-22', trigger: 'Adopted Luna (DOG-2024-0067)' },
    ],
    tags: ['Major Donor', 'Monthly Volunteer'], createdAt: '2024-01-10', updatedAt: '2024-09-22',
    totalDonations: 5200, totalVolunteerHours: 48, isActive: true,
  },
  {
    id: '9ad69d62-fc09-4e8f-ae99-06fc3d341656', tenantId: T1, firstName: 'Michael', lastName: 'Chen', email: 'mchen@email.com', phone: '(555) 234-5678',
    address: '456 Maple Ave', city: 'Dickson', state: 'TN', zip: '37055',
    roles: ['donor'],
    organizationId: '460abd3a-96a3-406f-a789-31c809f43f88', organizationName: 'Chen Technologies',
    moves: [
      { id: 'c73695d6-39ef-4e78-be0f-e334472504e4', tenantId: T1, personId: '9ad69d62-fc09-4e8f-ae99-06fc3d341656', fromRoles: [], toRoles: ['donor'], date: '2024-02-20', trigger: 'First donation — $5,000 to Capital Campaign (via Chen Technologies)' },
    ],
    tags: ['Major Donor'], createdAt: '2024-02-20', updatedAt: '2024-02-20',
    totalDonations: 12500, totalVolunteerHours: 0, isActive: true,
  },
  {
    id: '25bd7dda-49bd-462b-af85-7debbee79e5f', tenantId: T1, firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.r@email.com', phone: '(555) 345-6789',
    address: '789 Pine Rd', city: 'Dickson', state: 'TN', zip: '37055',
    roles: ['volunteer'],
    organizationId: 'f7f8ab01-91a7-43e2-b601-2ede15c29cf6', organizationName: 'Dickson County Community Bank',
    moves: [
      { id: 'bb40da22-b12d-4c80-b8a2-105e6efadb70', tenantId: T1, personId: '25bd7dda-49bd-462b-af85-7debbee79e5f', fromRoles: [], toRoles: ['volunteer'], date: '2024-03-05', trigger: 'Signed up for dog walking shifts' },
      { id: '27477c9f-c7a4-4ef8-99ed-a54925dccc0d', tenantId: T1, personId: '25bd7dda-49bd-462b-af85-7debbee79e5f', fromRoles: ['volunteer'], toRoles: ['volunteer', 'donor'], date: '2024-05-10', trigger: 'First donation — $350 after 2 months volunteering' },
      { id: 'c228696e-897a-4da4-b846-c05094ed7d24', tenantId: T1, personId: '25bd7dda-49bd-462b-af85-7debbee79e5f', fromRoles: ['volunteer', 'donor'], toRoles: ['volunteer'], date: '2024-08-01', trigger: 'Donor role lapsed — no donations in 90 days' },
    ],
    tags: ['Monthly Volunteer'], createdAt: '2024-03-05', updatedAt: '2024-08-01',
    totalDonations: 350, totalVolunteerHours: 120, isActive: true,
  },
  {
    id: '45fdc2da-d395-4efc-8867-e68790ec80ef', tenantId: T1, firstName: 'James', lastName: 'Williams', email: 'jwilliams@email.com', phone: '(555) 456-7890',
    roles: ['donor'],
    moves: [
      { id: '03c857bb-b0f8-420e-af85-04385ad47e88', tenantId: T1, personId: '45fdc2da-d395-4efc-8867-e68790ec80ef', fromRoles: [], toRoles: ['donor'], date: '2024-04-12', trigger: 'In-kind donation — 50 lbs dog food' },
    ],
    tags: [], createdAt: '2024-04-12', updatedAt: '2024-04-12',
    totalDonations: 800, totalVolunteerHours: 0, isActive: true,
  },
  {
    id: '94e6806b-d5a3-4304-8e83-b537763c8ba9', tenantId: T1, firstName: 'Lisa', lastName: 'Park', email: 'lpark@email.com', phone: '(555) 567-8901',
    roles: ['volunteer', 'adopter'],
    moves: [
      { id: 'e0cafbbf-e209-46d9-a91a-d605596cf53a', tenantId: T1, personId: '94e6806b-d5a3-4304-8e83-b537763c8ba9', fromRoles: [], toRoles: ['volunteer'], date: '2024-05-22', trigger: 'Signed up for front desk shifts' },
      { id: '9f7937a8-b166-4eab-9f54-515d57616be0', tenantId: T1, personId: '94e6806b-d5a3-4304-8e83-b537763c8ba9', fromRoles: ['volunteer'], toRoles: ['volunteer', 'adopter'], date: '2024-08-15', trigger: 'Adopted Whiskers (CAT-2024-0108)' },
    ],
    tags: ['Monthly Volunteer'], createdAt: '2024-05-22', updatedAt: '2024-08-15',
    totalDonations: 0, totalVolunteerHours: 64, isActive: true,
  },
];

// ========== Animals ==========

export const mockAnimals: Animal[] = [
  {
    id: '036ab3b6-eb50-495c-a392-aef3138c7534', tenantId: T1, animalId: 'DOG-2024-0042', name: 'Buddy', species: 'dog', breed: 'Golden Retriever',
    color: 'Golden', gender: 'male', size: 'large', age: '3 years', dateOfBirth: '2021-06-15', weight: 65,
    microchipId: 'MC-98765', status: 'available', intakeDate: '2024-09-01', intakeType: 'surrender',
    intakeCondition: 'healthy', alteredStatus: 'neutered',
    intakePersonId: '45fdc2da-d395-4efc-8867-e68790ec80ef', intakePersonName: 'James Williams',
    description: 'Friendly, well-socialized golden retriever. Good with kids and other dogs.',
    medicalNotes: ['Vaccinations up to date', 'Neutered'], tags: ['Good with Kids'],
    kennelLocation: 'D-101', createdAt: '2024-09-01', updatedAt: '2024-09-01',
  },
  {
    id: 'a3801464-2ff3-491f-be8f-3c9c7a856bbe', tenantId: T1, animalId: 'CAT-2024-0108', name: 'Whiskers', species: 'cat', breed: 'Domestic Shorthair',
    color: 'Tabby', gender: 'female', size: 'small', age: '5 years', dateOfBirth: '2019-03-20', weight: 9,
    status: 'adopted', intakeDate: '2024-07-15', intakeType: 'stray',
    intakeCondition: 'healthy', alteredStatus: 'spayed',
    outcomeType: 'adoption', outcomeDate: '2024-10-01',
    description: 'Calm and affectionate. Loves lap time. Indoor only recommended.',
    medicalNotes: ['Spayed', 'FIV negative', 'FeLV negative'], tags: ['Senior'],
    createdAt: '2024-07-15', updatedAt: '2024-10-01',
  },
  {
    id: 'da091858-4e52-4369-9939-d5df5602fd19', tenantId: T1, animalId: 'DOG-2024-0067', name: 'Luna', species: 'dog', breed: 'Labrador Mix',
    color: 'Black', gender: 'female', size: 'medium', age: '1 year', dateOfBirth: '2023-10-01', weight: 45,
    status: 'available', intakeDate: '2024-10-05', intakeType: 'transfer',
    intakeCondition: 'healthy', alteredStatus: 'spayed',
    description: 'Energetic young lab mix. Needs an active family. Basic obedience trained.',
    medicalNotes: ['Vaccinations up to date', 'Spayed', 'Heartworm negative'], tags: [],
    kennelLocation: 'D-103', createdAt: '2024-10-05', updatedAt: '2024-10-05',
  },
  {
    id: '73736718-0478-46a6-993b-52774655072d', tenantId: T1, animalId: 'CAT-2024-0115', name: 'Oliver', species: 'cat', breed: 'Siamese Mix',
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
    id: 'f5efe6d1-05f9-4e36-b998-bf307af7be7e', tenantId: T1, animalId: 'DOG-2024-0089', name: 'Max', species: 'dog', breed: 'German Shepherd',
    color: 'Black/Tan', gender: 'male', size: 'large', age: '4 years', dateOfBirth: '2020-08-12', weight: 80,
    status: 'foster', intakeDate: '2024-08-20', intakeType: 'surrender',
    intakeCondition: 'treatable-manageable', alteredStatus: 'neutered',
    fosterHomeId: 'a0bd340c-3695-44ab-b69d-2ab6fd453253',
    description: 'Loyal and protective. Best as only pet. Experienced owner preferred.',
    medicalNotes: ['Vaccinations up to date', 'Neutered', 'Hip dysplasia - managed'],
    tags: ['Special Needs'], createdAt: '2024-08-20', updatedAt: '2024-09-15',
  },
  {
    id: 'a07f7ca7-1faf-4fb2-b9b7-a3121c2d0c91', tenantId: T1, animalId: 'DOG-2024-0095', name: 'Rosie', species: 'dog', breed: 'Beagle',
    color: 'Tri-color', gender: 'female', size: 'medium', age: '6 years', dateOfBirth: '2018-02-14', weight: 28,
    status: 'euthanized', intakeDate: '2024-06-01', intakeType: 'stray',
    intakeCondition: 'unhealthy-untreatable', alteredStatus: 'spayed',
    outcomeType: 'euthanasia-shelter', outcomeDate: '2024-06-05',
    description: 'Found as stray in severe condition. Aggressive bone cancer.',
    medicalNotes: ['Severe osteosarcoma', 'Compassionate euthanasia recommended'],
    tags: [], createdAt: '2024-06-01', updatedAt: '2024-06-05',
  },
  {
    id: '84b79b93-c589-4dbb-9ab3-be1c3fdd5796', tenantId: T1, animalId: 'CAT-2024-0120', name: 'Mittens', species: 'cat', breed: 'Maine Coon Mix',
    color: 'Orange Tabby', gender: 'female', size: 'medium', age: '3 years', dateOfBirth: '2021-11-30', weight: 12,
    status: 'adopted', intakeDate: '2024-08-10', intakeType: 'surrender',
    intakeCondition: 'healthy', alteredStatus: 'spayed',
    outcomeType: 'adoption', outcomeDate: '2024-09-15',
    description: 'Playful and social. Gets along with other cats. Loves window perches.',
    medicalNotes: ['Vaccinations up to date', 'Spayed'],
    tags: ['Good with Kids'], createdAt: '2024-08-10', updatedAt: '2024-09-15',
  },
  {
    id: '53227b97-209d-457c-ab9d-a25d99a88734', tenantId: T1, animalId: 'DOG-2024-0101', name: 'Cooper', species: 'dog', breed: 'Pit Bull Mix',
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
    id: '460abd3a-96a3-406f-a789-31c809f43f88', tenantId: T1, name: 'Chen Technologies', type: 'corporation',
    ein: '36-1234567', contactName: 'Michael Chen', contactEmail: 'mchen@chentech.com', contactPhone: '(555) 234-5678',
    address: '100 Tech Parkway', city: 'Dickson', state: 'TN', zip: '37055',
    memberIds: ['9ad69d62-fc09-4e8f-ae99-06fc3d341656'], roles: ['donor', 'sponsor'],
    totalDonations: 25000, totalVolunteerHours: 0,
    matchingGiftProgram: true, matchRatio: 1.0,
    tags: ['Major Donor', 'Corporate Sponsor'], createdAt: '2024-02-15', updatedAt: '2024-10-20', isActive: true,
  },
  {
    id: 'f7f8ab01-91a7-43e2-b601-2ede15c29cf6', tenantId: T1, name: 'Dickson County Community Bank', type: 'corporation',
    ein: '36-9876543', contactName: 'David Park', contactEmail: 'dpark@scbank.com', contactPhone: '(555) 444-5555',
    address: '200 Main St', city: 'Dickson', state: 'TN', zip: '37055',
    memberIds: ['25bd7dda-49bd-462b-af85-7debbee79e5f'], roles: ['donor', 'volunteer'],
    totalDonations: 10000, totalVolunteerHours: 80,
    matchingGiftProgram: true, matchRatio: 0.5,
    tags: ['Corporate Volunteer'], createdAt: '2024-01-05', updatedAt: '2024-10-15', isActive: true,
  },
  {
    id: 'd79e04de-0abd-487e-904a-8a8f3b7cdd91', tenantId: T1, name: 'Paws & Claws Pet Supply', type: 'small-business',
    ein: '36-5555555', contactName: 'Karen Wright', contactEmail: 'karen@pawsclaws.com', contactPhone: '(555) 666-7777',
    address: '50 Commerce Dr', city: 'Dickson', state: 'TN', zip: '37055',
    memberIds: [], roles: ['donor'],
    totalDonations: 3200, totalVolunteerHours: 0,
    matchingGiftProgram: false,
    tags: [], createdAt: '2024-03-20', updatedAt: '2024-09-30', isActive: true,
  },
  {
    id: 'f90f8d66-a4be-4671-8904-5b964634c241', tenantId: T1, name: 'Heart of Tennessee Foundation', type: 'foundation',
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
  { id: '0a4a1e87-b2f9-43b4-b07d-f9af0d85d107', tenantId: T1, personId: '01043c9b-e4f2-4183-8c65-37c092130416', personName: 'Sarah Johnson', type: 'monetary', amount: 2500, description: 'Annual fund donation', date: '2024-10-01', category: 'General Fund', receiptIssued: true },
  { id: 'bfbdab62-48d7-4ed9-8dc1-b047933c8a95', tenantId: T1, personId: '9ad69d62-fc09-4e8f-ae99-06fc3d341656', personName: 'Michael Chen', organizationId: '460abd3a-96a3-406f-a789-31c809f43f88', organizationName: 'Chen Technologies', type: 'monetary', amount: 5000, description: 'Building renovation fund', date: '2024-10-05', category: 'Capital Campaign', receiptIssued: true },
  { id: 'a0fefb85-6edd-472e-8023-ff43f61eabe6', tenantId: T1, personId: '01043c9b-e4f2-4183-8c65-37c092130416', personName: 'Sarah Johnson', type: 'time', hours: 8, description: 'Weekend adoption event', date: '2024-10-12', category: 'Events', receiptIssued: false },
  { id: '5a1a18c8-ac1e-40cf-a80f-869be2cf861d', tenantId: T1, personId: '25bd7dda-49bd-462b-af85-7debbee79e5f', personName: 'Emily Rodriguez', organizationId: 'f7f8ab01-91a7-43e2-b601-2ede15c29cf6', organizationName: 'Dickson County Community Bank', type: 'time', hours: 16, description: 'Dog walking and socialization', date: '2024-10-15', category: 'Animal Care', receiptIssued: false },
  { id: '48bf9bb9-856a-4aa8-af9c-22d970db7ce7', tenantId: T1, personId: '45fdc2da-d395-4efc-8867-e68790ec80ef', personName: 'James Williams', type: 'in-kind', itemDescription: '50 lbs premium dog food', estimatedValue: 120, description: 'Pet food donation', date: '2024-10-18', category: 'Supplies', receiptIssued: true },
  { id: '08f9f2c3-ffcb-44f1-8690-b1b015b447d5', tenantId: T1, organizationId: '460abd3a-96a3-406f-a789-31c809f43f88', organizationName: 'Chen Technologies', type: 'monetary', amount: 7500, description: 'Corporate matching gift — year end', date: '2024-10-20', category: 'General Fund', receiptIssued: true },
  { id: '1df2da73-2f59-46fc-b44a-595e2e6a42de', tenantId: T1, personId: '94e6806b-d5a3-4304-8e83-b537763c8ba9', personName: 'Lisa Park', type: 'time', hours: 24, description: 'Front desk and phone support', date: '2024-10-22', category: 'Administration', receiptIssued: false },
  { id: '1cef798c-5146-4bf6-b083-0100d3c90646', tenantId: T1, personId: '01043c9b-e4f2-4183-8c65-37c092130416', personName: 'Sarah Johnson', type: 'in-kind', itemDescription: 'Blankets and towels (20 items)', estimatedValue: 200, description: 'Comfort supplies', date: '2024-10-25', category: 'Supplies', receiptIssued: true },
  { id: '0f2bee07-46bd-41b2-88a1-0673692f7033', tenantId: T1, organizationId: 'd79e04de-0abd-487e-904a-8a8f3b7cdd91', organizationName: 'Paws & Claws Pet Supply', type: 'in-kind', itemDescription: 'Pet food and toys (bulk)', estimatedValue: 1800, description: 'Quarterly supply donation', date: '2024-10-28', category: 'Supplies', receiptIssued: true },
  { id: '631bc111-1071-4271-a3bd-9a1bba616717', tenantId: T1, organizationId: 'f90f8d66-a4be-4671-8904-5b964634c241', organizationName: 'Heart of Tennessee Foundation', type: 'monetary', amount: 25000, description: 'Annual operating grant', date: '2024-07-01', category: 'General Fund', receiptIssued: true },
  { id: '64b6d067-30df-4ca4-a020-eddf42c3f021', tenantId: T1, organizationId: 'f7f8ab01-91a7-43e2-b601-2ede15c29cf6', organizationName: 'Dickson County Community Bank', type: 'monetary', amount: 10000, description: 'Shelter renovation sponsorship', date: '2024-09-15', category: 'Capital Campaign', receiptIssued: true },
];

// ========== Adopters ==========

export const mockAdopters: Adopter[] = [
  {
    id: '4b936ad6-21fb-4cd9-9879-b940ca67b096', tenantId: T1, firstName: 'Rachel', lastName: 'Green', email: 'rgreen@email.com', phone: '(555) 678-9012',
    address: '100 Church St', city: 'Dickson', state: 'TN', zip: '37055',
    structuredNotes: [
      { id: 'cebd11bf-706f-4231-99a9-d5d4d16ef401', tenantId: T1, tagId: '44922480-c4d8-4db4-b729-1055c7d7871c', tagLabel: 'Excellent Adopter', severity: 'info', date: '2024-08-01', addedBy: 'Admin' },
    ],
    adoptionHistory: [], returnHistory: [], flagged: false,
    createdAt: '2024-06-01', updatedAt: '2024-08-01',
  },
  {
    id: 'adbfabe1-4939-4dff-bf9e-d0c357399b8c', tenantId: T1, firstName: 'Tom', lastName: 'Baker', email: 'tbaker@email.com', phone: '(555) 789-0123',
    address: '200 Elm St', city: 'Dickson', state: 'TN', zip: '37055',
    structuredNotes: [
      { id: '5d4d167e-c5eb-4d1f-92dd-8121e61797f1', tenantId: T1, tagId: '95d1d020-cad5-4bb0-b630-426a586ec767', tagLabel: 'Repeat Returner', severity: 'critical', date: '2024-09-20', addedBy: 'Admin' },
      { id: '2c39105c-a7e7-4baf-abba-2989fe05ad3a', tenantId: T1, tagId: 'c9185168-4ddd-4b7a-8553-b7ceb3632ce3', tagLabel: 'Behavioral Issues Reported', severity: 'warning', date: '2024-09-20', addedBy: 'Admin' },
    ],
    adoptionHistory: [], returnHistory: [
      { id: 'd8067897-6d27-435b-abac-983119fbbc54', tenantId: T1, adoptionId: '1f3e994b-3256-42e1-8bc7-de2b2c1329af', animalId: 'ff676163-f81a-46ea-ad76-509fe92529ee', animalName: 'Rocky', adopterId: 'adbfabe1-4939-4dff-bf9e-d0c357399b8c', date: '2024-05-15', reasonTagId: '630f94f4-40fa-4bd6-bb31-f1693ea40092', reasonLabel: 'Surrender - Behavioral' },
      { id: '31eb4a6a-a74f-4291-8840-37588d63757b', tenantId: T1, adoptionId: '3fb5b8c5-3f31-4084-919a-23b6d76266a3', animalId: 'aafae502-7cdb-4716-a9d4-ef168cdd7265', animalName: 'Daisy', adopterId: 'adbfabe1-4939-4dff-bf9e-d0c357399b8c', date: '2024-09-10', reasonTagId: '630f94f4-40fa-4bd6-bb31-f1693ea40092', reasonLabel: 'Surrender - Behavioral' },
    ],
    flagged: true,
    createdAt: '2024-03-15', updatedAt: '2024-09-20',
  },
  {
    id: '1c02c649-26f5-43c7-a55c-0a7e255bc8ee', tenantId: T1, firstName: 'Nancy', lastName: 'Drew', email: 'ndrew@email.com', phone: '(555) 890-1234',
    structuredNotes: [
      { id: '6970d0a0-2339-48fc-98a5-5a4b132d828a', tenantId: T1, tagId: '916467e1-b906-4d8b-99a3-ac4753b627e9', tagLabel: 'Multiple Animals Adopted Quickly', severity: 'warning', date: '2024-10-01', addedBy: 'System' },
    ],
    adoptionHistory: [], returnHistory: [],
    flagged: false,
    createdAt: '2024-07-20', updatedAt: '2024-10-01',
  },
];

// ========== Adoptions ==========

export const mockAdoptions: Adoption[] = [
  { id: 'a557b61c-80fc-4a91-83b8-b97a0530ad03', tenantId: T1, animalId: 'a3801464-2ff3-491f-be8f-3c9c7a856bbe', animalName: 'Whiskers', adopterId: '4b936ad6-21fb-4cd9-9879-b940ca67b096', adopterName: 'Rachel Green', date: '2024-10-01', fee: 75, status: 'completed' },
  { id: 'f9eaff68-961a-421a-b595-b8a3a3caf226', tenantId: T1, animalId: 'ff676163-f81a-46ea-ad76-509fe92529ee', animalName: 'Rocky', adopterId: 'adbfabe1-4939-4dff-bf9e-d0c357399b8c', adopterName: 'Tom Baker', date: '2024-03-20', fee: 150, status: 'returned', returnDate: '2024-05-15', returnReason: 'Surrender - Behavioral' },
  { id: '97c0baa7-4268-4fdb-a649-7c658a54485b', tenantId: T1, animalId: 'aafae502-7cdb-4716-a9d4-ef168cdd7265', animalName: 'Daisy', adopterId: 'adbfabe1-4939-4dff-bf9e-d0c357399b8c', adopterName: 'Tom Baker', date: '2024-07-01', fee: 100, status: 'returned', returnDate: '2024-09-10', returnReason: 'Surrender - Behavioral' },
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
  { id: '2311a0cf-13af-40ca-a331-d53e44d1d2e7', tenantId: T1, animalId: '036ab3b6-eb50-495c-a392-aef3138c7534', type: 'vaccination', description: 'DHPP Booster', date: '2024-09-01', veterinarian: 'Dr. Sarah Martinez', nextDueDate: '2025-09-01', createdAt: '2024-09-01' },
  { id: '449ccaeb-6097-4a40-9973-0fd95f3d86b2', tenantId: T1, animalId: '036ab3b6-eb50-495c-a392-aef3138c7534', type: 'vaccination', description: 'Rabies Vaccination', date: '2024-09-01', veterinarian: 'Dr. Sarah Martinez', nextDueDate: '2025-09-01', createdAt: '2024-09-01' },
  { id: '3ffdb86b-8c92-4908-a654-9126ad3cdc84', tenantId: T1, animalId: '036ab3b6-eb50-495c-a392-aef3138c7534', type: 'surgery', description: 'Neuter Surgery', date: '2024-09-05', veterinarian: 'Dr. Sarah Martinez', notes: 'Routine, no complications', createdAt: '2024-09-05' },
  { id: 'f45e215d-d19e-4052-97c5-2c756e3ff5c3', tenantId: T1, animalId: 'a3801464-2ff3-491f-be8f-3c9c7a856bbe', type: 'vaccination', description: 'FVRCP', date: '2024-07-16', veterinarian: 'Dr. James Wilson', nextDueDate: '2025-07-16', createdAt: '2024-07-16' },
  { id: '589db768-b052-4419-8d67-07ab531f69b5', tenantId: T1, animalId: 'a3801464-2ff3-491f-be8f-3c9c7a856bbe', type: 'test', description: 'FIV/FeLV Test - Negative', date: '2024-07-16', veterinarian: 'Dr. James Wilson', createdAt: '2024-07-16' },
  { id: '6a45ba37-4d06-46f1-9e80-6bb98b7f2994', tenantId: T1, animalId: 'da091858-4e52-4369-9939-d5df5602fd19', type: 'vaccination', description: 'DHPP + Bordetella', date: '2024-10-05', veterinarian: 'Dr. Sarah Martinez', nextDueDate: '2025-10-05', createdAt: '2024-10-05' },
  { id: '5ff2def9-3249-4428-b0b3-60461eba47c5', tenantId: T1, animalId: 'da091858-4e52-4369-9939-d5df5602fd19', type: 'test', description: 'Heartworm Test - Negative', date: '2024-10-05', veterinarian: 'Dr. Sarah Martinez', createdAt: '2024-10-05' },
  { id: 'f74a96ec-0ea1-4588-b34d-68d6d3c080aa', tenantId: T1, animalId: '73736718-0478-46a6-993b-52774655072d', type: 'exam', description: 'Intake Examination', date: '2024-10-10', veterinarian: 'Dr. James Wilson', notes: 'Underweight, dental issues noted. Start feeding plan.', createdAt: '2024-10-10' },
  { id: '8b725c1a-d6dd-456d-82c0-21c039b94faf', tenantId: T1, animalId: '73736718-0478-46a6-993b-52774655072d', type: 'treatment', description: 'Deworming Treatment', date: '2024-10-10', veterinarian: 'Dr. James Wilson', createdAt: '2024-10-10' },
  { id: 'be066526-a006-48ce-b9ba-97ee8e308e49', tenantId: T1, animalId: 'f5efe6d1-05f9-4e36-b998-bf307af7be7e', type: 'exam', description: 'Hip Dysplasia Assessment', date: '2024-08-22', veterinarian: 'Dr. Sarah Martinez', notes: 'Moderate bilateral hip dysplasia. Manage with joint supplements and controlled exercise.', createdAt: '2024-08-22' },
  { id: 'ee58022b-049a-43a3-ae4a-81383ecba686', tenantId: T1, animalId: 'f5efe6d1-05f9-4e36-b998-bf307af7be7e', type: 'medication', description: 'Glucosamine/Chondroitin Joint Supplement', date: '2024-08-22', veterinarian: 'Dr. Sarah Martinez', notes: 'Daily — continue indefinitely', createdAt: '2024-08-22' },
  { id: 'da662fa0-b422-4ec1-8a92-8144622ae6a4', tenantId: T1, animalId: '53227b97-209d-457c-ab9d-a25d99a88734', type: 'exam', description: 'Intake Examination', date: '2024-10-28', veterinarian: 'Dr. James Wilson', notes: 'Healthy, good body condition. No microchip found.', createdAt: '2024-10-28' },
];

// ========== Foster Homes ==========

export const mockFosterHomes: FosterHome[] = [
  {
    id: 'a0bd340c-3695-44ab-b69d-2ab6fd453253', tenantId: T1, personId: '01043c9b-e4f2-4183-8c65-37c092130416', firstName: 'Sarah', lastName: 'Johnson',
    email: 'sarah.j@email.com', phone: '(555) 123-4567',
    address: '123 Oak St', city: 'Dickson', state: 'TN', zip: '37055',
    capacity: 2, currentCount: 1,
    speciesPreference: ['dog'], sizePreference: ['medium', 'large'],
    isActive: true, notes: 'Has fenced yard. Experienced with large breeds.',
    createdAt: '2024-06-01', updatedAt: '2024-09-15',
  },
  {
    id: '29e18cbd-af89-4458-9331-3779cf9b7f20', tenantId: T1, firstName: 'Maria', lastName: 'Garcia',
    email: 'mgarcia@email.com', phone: '(555) 222-3333',
    address: '800 Elm St', city: 'Dickson', state: 'TN', zip: '37055',
    capacity: 3, currentCount: 0,
    speciesPreference: ['cat', 'dog'], sizePreference: ['small', 'medium'],
    isActive: true, notes: 'Has experience with kittens and bottle-feeding neonates.',
    createdAt: '2024-04-10', updatedAt: '2024-10-01',
  },
  {
    id: '8a690109-9fc5-47a9-a9a2-4f771b200842', tenantId: T1, firstName: 'David', lastName: 'Thompson',
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
    id: '4ec51233-c56e-4d0a-a081-65242d029011', tenantId: T1, animalId: 'f5efe6d1-05f9-4e36-b998-bf307af7be7e', animalName: 'Max',
    fosterHomeId: 'a0bd340c-3695-44ab-b69d-2ab6fd453253', fosterName: 'Sarah Johnson',
    startDate: '2024-09-15', status: 'active',
    notes: 'Max is doing well with daily joint supplement regimen.',
    createdAt: '2024-09-15',
  },
  {
    id: '3215d7e5-bd12-4f6d-ab47-0d265e1a1624', tenantId: T1, animalId: '84b79b93-c589-4dbb-9ab3-be1c3fdd5796', animalName: 'Mittens',
    fosterHomeId: '29e18cbd-af89-4458-9331-3779cf9b7f20', fosterName: 'Maria Garcia',
    startDate: '2024-08-15', endDate: '2024-09-10', status: 'completed',
    notes: 'Mittens socialized well. Ready for adoption.',
    createdAt: '2024-08-15',
  },
];

// ========== Kennel Locations ==========

export const mockKennelLocations: KennelLocation[] = [
  // Dog Zone
  { id: 'b90ff1f5-507b-476f-8fb3-37a603e9e89e', tenantId: T1, name: 'D-101', zone: 'Dog Wing A', species: 'dog', size: 'large', isOccupied: true, currentAnimalId: '036ab3b6-eb50-495c-a392-aef3138c7534', currentAnimalName: 'Buddy' },
  { id: '5286f373-eb69-4afe-8ab4-113ef7053d91', tenantId: T1, name: 'D-102', zone: 'Dog Wing A', species: 'dog', size: 'large', isOccupied: false },
  { id: 'd7e4d971-ec0a-45e8-aac4-a9d8c0fc6869', tenantId: T1, name: 'D-103', zone: 'Dog Wing A', species: 'dog', size: 'medium', isOccupied: true, currentAnimalId: 'da091858-4e52-4369-9939-d5df5602fd19', currentAnimalName: 'Luna' },
  { id: '350de144-558d-428f-8314-eca38765699b', tenantId: T1, name: 'D-104', zone: 'Dog Wing A', species: 'dog', size: 'medium', isOccupied: false },
  { id: '3fecb5d1-61a7-4735-8c0b-618531ec1c5a', tenantId: T1, name: 'D-105', zone: 'Dog Wing B', species: 'dog', size: 'large', isOccupied: true, currentAnimalId: '53227b97-209d-457c-ab9d-a25d99a88734', currentAnimalName: 'Cooper' },
  { id: '0dbe6512-93d1-4ea7-9667-d05ed23b9e74', tenantId: T1, name: 'D-106', zone: 'Dog Wing B', species: 'dog', size: 'large', isOccupied: false },
  { id: 'bebbe72a-7e97-4871-b4bd-ca95809a7455', tenantId: T1, name: 'D-107', zone: 'Dog Wing B', species: 'dog', size: 'small', isOccupied: false },
  { id: '6d338d34-8047-403f-8ba8-d2e08826a3e9', tenantId: T1, name: 'D-108', zone: 'Dog Wing B', species: 'dog', size: 'small', isOccupied: false },
  // Cat Zone
  { id: '131b462d-f638-464c-84b9-0ac8f5be6cfd', tenantId: T1, name: 'C-201', zone: 'Cat Room', species: 'cat', size: 'small', isOccupied: false },
  { id: '9fca9ca1-1fe2-426c-b29e-2e768e1f6f3e', tenantId: T1, name: 'C-202', zone: 'Cat Room', species: 'cat', size: 'small', isOccupied: false },
  { id: '2f7ee224-5b80-4a34-a072-2a1a77a1ea19', tenantId: T1, name: 'C-203', zone: 'Cat Room', species: 'cat', size: 'medium', isOccupied: false },
  { id: 'c6290285-0fb4-4132-96d1-dc36b0253331', tenantId: T1, name: 'C-204', zone: 'Cat Room', species: 'cat', size: 'medium', isOccupied: false },
  { id: 'f531c33e-efd1-48e6-b9b9-d4ad2c3e1f99', tenantId: T1, name: 'C-205', zone: 'Cat Isolation', species: 'cat', size: 'medium', isOccupied: true, currentAnimalId: '73736718-0478-46a6-993b-52774655072d', currentAnimalName: 'Oliver', notes: 'Medical hold — dental eval pending' },
  { id: '0bd2fab8-a81e-43a0-88c5-7dc338a35b03', tenantId: T1, name: 'C-206', zone: 'Cat Isolation', species: 'cat', size: 'small', isOccupied: false },
];

// ========== Adoption Applications ==========

export const mockAdoptionApplications: AdoptionApplication[] = [
  {
    id: 'fa104c07-65b4-4c71-b48a-dbc5e3779481', tenantId: T1, animalId: '036ab3b6-eb50-495c-a392-aef3138c7534', animalName: 'Buddy',
    applicantName: 'Jennifer Martinez', applicantEmail: 'jmartinez@email.com', applicantPhone: '(555) 111-2222',
    address: '400 Birch Lane', city: 'Dickson', state: 'TN', zip: '37055',
    householdType: 'house', hasYard: true, hasFence: true,
    otherPets: 'One cat, indoor only', hasChildren: true, childrenAges: '8, 12',
    experience: 'Have owned dogs my whole life. Previous golden retriever lived to 14.',
    veterinarianName: 'Dr. Sarah Martinez', veterinarianPhone: '(555) 333-4444',
    reasonForAdopting: 'Looking for a family dog. Kids are ready for the responsibility. We have a large fenced yard.',
    status: 'approved', reviewNotes: 'Excellent candidate. Vet reference checked out.', reviewedBy: 'Alice Admin',
    submittedAt: '2024-10-20', reviewedAt: '2024-10-22',
  },
  {
    id: 'bdef8c20-e5ad-4b4e-8a03-8e7b2a940194', tenantId: T1, animalId: 'da091858-4e52-4369-9939-d5df5602fd19', animalName: 'Luna',
    applicantName: 'Kevin Park', applicantEmail: 'kpark@email.com', applicantPhone: '(555) 555-6666',
    address: '250 Cedar St', city: 'Dickson', state: 'TN', zip: '37055',
    householdType: 'apartment', hasYard: false, hasFence: false,
    otherPets: 'None', hasChildren: false,
    experience: 'First time dog owner, but have been researching breeds extensively.',
    reasonForAdopting: 'I work from home and want a companion. I run daily and need an active dog.',
    status: 'under-review',
    submittedAt: '2024-10-25',
  },
  {
    id: '68bd6158-a734-4ea7-af1d-616b0224493f', tenantId: T1, animalId: '036ab3b6-eb50-495c-a392-aef3138c7534', animalName: 'Buddy',
    applicantName: 'Tom Baker', applicantEmail: 'tbaker@email.com', applicantPhone: '(555) 789-0123',
    address: '200 Elm St', city: 'Dickson', state: 'TN', zip: '37055',
    householdType: 'house', hasYard: true, hasFence: false,
    otherPets: 'None currently', hasChildren: false,
    experience: 'Have had several dogs but they were returned to the shelter.',
    reasonForAdopting: 'Want to try again with a calmer breed.',
    status: 'denied', reviewNotes: 'Applicant is flagged as repeat returner (adbfabe1-4939-4dff-bf9e-d0c357399b8c). Two previous returns for behavioral issues.', reviewedBy: 'Alice Admin',
    submittedAt: '2024-10-18', reviewedAt: '2024-10-19',
  },
  {
    id: 'e66e16ba-9d8b-4e40-be0c-64dcd1c5dde0', tenantId: T1, animalId: 'da091858-4e52-4369-9939-d5df5602fd19', animalName: 'Luna',
    applicantName: 'Sarah Williams', applicantEmail: 'swilliams@email.com', applicantPhone: '(555) 777-8888',
    address: '120 Oak Court', city: 'Dickson', state: 'TN', zip: '37055',
    householdType: 'house', hasYard: true, hasFence: true,
    otherPets: 'One senior dog, friendly with other dogs', hasChildren: true, childrenAges: '5',
    experience: 'Lifelong dog owner. Currently have a 10-year-old lab.',
    veterinarianName: 'Dr. James Wilson', veterinarianPhone: '(555) 999-0000',
    reasonForAdopting: 'Our senior dog could use a companion, and Luna seems like a great fit for our active family.',
    status: 'submitted',
    submittedAt: '2024-10-27',
  },
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
