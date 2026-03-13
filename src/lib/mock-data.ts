import {
  Person,
  Animal,
  Donation,
  Adopter,
  Adoption,
  AdminTag,
  AlertRule,
  DashboardStats,
} from './types';

export const mockTags: AdminTag[] = [
  { id: 'tag-1', label: 'Repeat Returner', category: 'adopter', severity: 'critical', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-2', label: 'Hoarding Concern', category: 'adopter', severity: 'critical', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-3', label: 'Behavioral Issues Reported', category: 'adopter', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-4', label: 'Inadequate Housing', category: 'adopter', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-5', label: 'Excellent Adopter', category: 'adopter', severity: 'info', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-6', label: 'Senior', category: 'animal', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-7', label: 'Special Needs', category: 'animal', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-8', label: 'Good with Kids', category: 'animal', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-9', label: 'Major Donor', category: 'person', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-10', label: 'Monthly Volunteer', category: 'person', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-11', label: 'Pet Food', category: 'donation', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-12', label: 'Medical Supplies', category: 'donation', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-13', label: 'Animal Not Returned in Good Health', category: 'adopter', severity: 'critical', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-14', label: 'Multiple Animals Adopted Quickly', category: 'adopter', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-15', label: 'Surrender - Moving', category: 'alert', severity: 'info', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-16', label: 'Surrender - Allergies', category: 'alert', severity: 'info', isActive: true, createdAt: '2024-01-01' },
  { id: 'tag-17', label: 'Surrender - Behavioral', category: 'alert', severity: 'warning', isActive: true, createdAt: '2024-01-01' },
];

export const mockAlertRules: AlertRule[] = [
  { id: 'rule-1', name: 'Repeat Returner Alert', description: 'Flag adopters who return 2 or more animals', condition: 'return_count_gte', threshold: 2, severity: 'critical', isActive: true },
  { id: 'rule-2', name: 'Quick Adoption Pattern', description: 'Flag adopters with 3+ adoptions in 6 months', condition: 'return_count_gte', threshold: 3, severity: 'warning', isActive: true },
];

export const mockPeople: Person[] = [
  {
    id: 'p-1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567',
    address: '123 Oak St', city: 'Springfield', state: 'IL', zip: '62701',
    roles: ['donor', 'volunteer', 'adopter'],
    moves: [
      { id: 'm-1a', personId: 'p-1', fromRoles: [], toRoles: ['donor'], date: '2024-01-10', trigger: 'First donation — $500 to General Fund' },
      { id: 'm-1b', personId: 'p-1', fromRoles: ['donor'], toRoles: ['donor', 'volunteer'], date: '2024-06-15', trigger: 'Signed up for weekend adoption events' },
      { id: 'm-1c', personId: 'p-1', fromRoles: ['donor', 'volunteer'], toRoles: ['donor', 'volunteer', 'adopter'], date: '2024-09-22', trigger: 'Adopted Luna (DOG-2024-0067)' },
    ],
    tags: ['Major Donor', 'Monthly Volunteer'], createdAt: '2024-01-10', updatedAt: '2024-09-22',
    totalDonations: 5200, totalVolunteerHours: 48, isActive: true,
  },
  {
    id: 'p-2', firstName: 'Michael', lastName: 'Chen', email: 'mchen@email.com', phone: '(555) 234-5678',
    address: '456 Maple Ave', city: 'Springfield', state: 'IL', zip: '62702',
    roles: ['donor'],
    moves: [
      { id: 'm-2a', personId: 'p-2', fromRoles: [], toRoles: ['donor'], date: '2024-02-20', trigger: 'First donation — $5,000 to Capital Campaign' },
    ],
    tags: ['Major Donor'], createdAt: '2024-02-20', updatedAt: '2024-02-20',
    totalDonations: 12500, totalVolunteerHours: 0, isActive: true,
  },
  {
    id: 'p-3', firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.r@email.com', phone: '(555) 345-6789',
    address: '789 Pine Rd', city: 'Springfield', state: 'IL', zip: '62703',
    roles: ['volunteer'],
    moves: [
      { id: 'm-3a', personId: 'p-3', fromRoles: [], toRoles: ['volunteer'], date: '2024-03-05', trigger: 'Signed up for dog walking shifts' },
      { id: 'm-3b', personId: 'p-3', fromRoles: ['volunteer'], toRoles: ['volunteer', 'donor'], date: '2024-05-10', trigger: 'First donation — $350 after 2 months volunteering' },
      { id: 'm-3c', personId: 'p-3', fromRoles: ['volunteer', 'donor'], toRoles: ['volunteer'], date: '2024-08-01', trigger: 'Donor role lapsed — no donations in 90 days' },
    ],
    tags: ['Monthly Volunteer'], createdAt: '2024-03-05', updatedAt: '2024-08-01',
    totalDonations: 350, totalVolunteerHours: 120, isActive: true,
  },
  {
    id: 'p-4', firstName: 'James', lastName: 'Williams', email: 'jwilliams@email.com', phone: '(555) 456-7890',
    roles: ['donor'],
    moves: [
      { id: 'm-4a', personId: 'p-4', fromRoles: [], toRoles: ['donor'], date: '2024-04-12', trigger: 'In-kind donation — 50 lbs dog food' },
    ],
    tags: [], createdAt: '2024-04-12', updatedAt: '2024-04-12',
    totalDonations: 800, totalVolunteerHours: 0, isActive: true,
  },
  {
    id: 'p-5', firstName: 'Lisa', lastName: 'Park', email: 'lpark@email.com', phone: '(555) 567-8901',
    roles: ['volunteer', 'adopter'],
    moves: [
      { id: 'm-5a', personId: 'p-5', fromRoles: [], toRoles: ['volunteer'], date: '2024-05-22', trigger: 'Signed up for front desk shifts' },
      { id: 'm-5b', personId: 'p-5', fromRoles: ['volunteer'], toRoles: ['volunteer', 'adopter'], date: '2024-08-15', trigger: 'Adopted Whiskers (CAT-2024-0108)' },
    ],
    tags: ['Monthly Volunteer'], createdAt: '2024-05-22', updatedAt: '2024-08-15',
    totalDonations: 0, totalVolunteerHours: 64, isActive: true,
  },
];

export const mockAnimals: Animal[] = [
  {
    id: 'a-1', animalId: 'DOG-2024-0042', name: 'Buddy', species: 'dog', breed: 'Golden Retriever',
    color: 'Golden', gender: 'male', size: 'large', age: '3 years', weight: 65,
    microchipId: 'MC-98765', status: 'available', intakeDate: '2024-09-01', intakeType: 'surrender',
    intakePersonId: 'p-4', intakePersonName: 'James Williams',
    description: 'Friendly, well-socialized golden retriever. Good with kids and other dogs.',
    medicalNotes: ['Vaccinations up to date', 'Neutered'], tags: ['Good with Kids'],
    createdAt: '2024-09-01', updatedAt: '2024-09-01',
  },
  {
    id: 'a-2', animalId: 'CAT-2024-0108', name: 'Whiskers', species: 'cat', breed: 'Domestic Shorthair',
    color: 'Tabby', gender: 'female', size: 'small', age: '5 years', weight: 9,
    status: 'adopted', intakeDate: '2024-07-15', intakeType: 'stray',
    description: 'Calm and affectionate. Loves lap time. Indoor only recommended.',
    medicalNotes: ['Spayed', 'FIV negative', 'FeLV negative'], tags: ['Senior'],
    createdAt: '2024-07-15', updatedAt: '2024-10-01',
  },
  {
    id: 'a-3', animalId: 'DOG-2024-0067', name: 'Luna', species: 'dog', breed: 'Labrador Mix',
    color: 'Black', gender: 'female', size: 'medium', age: '1 year', weight: 45,
    status: 'available', intakeDate: '2024-10-05', intakeType: 'transfer',
    description: 'Energetic young lab mix. Needs an active family. Basic obedience trained.',
    medicalNotes: ['Vaccinations up to date', 'Spayed', 'Heartworm negative'], tags: [],
    createdAt: '2024-10-05', updatedAt: '2024-10-05',
  },
  {
    id: 'a-4', animalId: 'CAT-2024-0115', name: 'Oliver', species: 'cat', breed: 'Siamese Mix',
    color: 'Cream/Brown', gender: 'male', size: 'medium', age: '2 years', weight: 11,
    status: 'medical-hold', intakeDate: '2024-10-10', intakeType: 'confiscation',
    description: 'Shy but warming up. Needs a quiet home. May have dental issues.',
    medicalNotes: ['Needs dental evaluation', 'Neutered', 'Underweight - on feeding plan'],
    tags: ['Special Needs'], createdAt: '2024-10-10', updatedAt: '2024-10-10',
  },
  {
    id: 'a-5', animalId: 'DOG-2024-0089', name: 'Max', species: 'dog', breed: 'German Shepherd',
    color: 'Black/Tan', gender: 'male', size: 'large', age: '4 years', weight: 80,
    status: 'foster', intakeDate: '2024-08-20', intakeType: 'surrender',
    description: 'Loyal and protective. Best as only pet. Experienced owner preferred.',
    medicalNotes: ['Vaccinations up to date', 'Neutered', 'Hip dysplasia - managed'],
    tags: ['Special Needs'], createdAt: '2024-08-20', updatedAt: '2024-09-15',
  },
];

export const mockDonations: Donation[] = [
  { id: 'd-1', personId: 'p-1', personName: 'Sarah Johnson', type: 'monetary', amount: 2500, description: 'Annual fund donation', date: '2024-10-01', category: 'General Fund', receiptIssued: true },
  { id: 'd-2', personId: 'p-2', personName: 'Michael Chen', type: 'monetary', amount: 5000, description: 'Building renovation fund', date: '2024-10-05', category: 'Capital Campaign', receiptIssued: true },
  { id: 'd-3', personId: 'p-1', personName: 'Sarah Johnson', type: 'time', hours: 8, description: 'Weekend adoption event', date: '2024-10-12', category: 'Events', receiptIssued: false },
  { id: 'd-4', personId: 'p-3', personName: 'Emily Rodriguez', type: 'time', hours: 16, description: 'Dog walking and socialization', date: '2024-10-15', category: 'Animal Care', receiptIssued: false },
  { id: 'd-5', personId: 'p-4', personName: 'James Williams', type: 'in-kind', itemDescription: '50 lbs premium dog food', estimatedValue: 120, description: 'Pet food donation', date: '2024-10-18', category: 'Supplies', receiptIssued: true },
  { id: 'd-6', personId: 'p-2', personName: 'Michael Chen', type: 'monetary', amount: 7500, description: 'Matching gift - year end', date: '2024-10-20', category: 'General Fund', receiptIssued: true },
  { id: 'd-7', personId: 'p-5', personName: 'Lisa Park', type: 'time', hours: 24, description: 'Front desk and phone support', date: '2024-10-22', category: 'Administration', receiptIssued: false },
  { id: 'd-8', personId: 'p-1', personName: 'Sarah Johnson', type: 'in-kind', itemDescription: 'Blankets and towels (20 items)', estimatedValue: 200, description: 'Comfort supplies', date: '2024-10-25', category: 'Supplies', receiptIssued: true },
];

export const mockAdopters: Adopter[] = [
  {
    id: 'ad-1', firstName: 'Rachel', lastName: 'Green', email: 'rgreen@email.com', phone: '(555) 678-9012',
    address: '100 Central Park W', city: 'Springfield', state: 'IL', zip: '62704',
    structuredNotes: [
      { id: 'sn-1', tagId: 'tag-5', tagLabel: 'Excellent Adopter', severity: 'info', date: '2024-08-01', addedBy: 'Admin' },
    ],
    adoptionHistory: [], returnHistory: [], flagged: false,
    createdAt: '2024-06-01', updatedAt: '2024-08-01',
  },
  {
    id: 'ad-2', firstName: 'Tom', lastName: 'Baker', email: 'tbaker@email.com', phone: '(555) 789-0123',
    address: '200 Elm St', city: 'Springfield', state: 'IL', zip: '62705',
    structuredNotes: [
      { id: 'sn-2', tagId: 'tag-1', tagLabel: 'Repeat Returner', severity: 'critical', date: '2024-09-20', addedBy: 'Admin' },
      { id: 'sn-3', tagId: 'tag-3', tagLabel: 'Behavioral Issues Reported', severity: 'warning', date: '2024-09-20', addedBy: 'Admin' },
    ],
    adoptionHistory: [], returnHistory: [
      { id: 'ret-1', adoptionId: 'adp-old-1', animalId: 'a-old-1', animalName: 'Rocky', adopterId: 'ad-2', date: '2024-05-15', reasonTagId: 'tag-17', reasonLabel: 'Surrender - Behavioral' },
      { id: 'ret-2', adoptionId: 'adp-old-2', animalId: 'a-old-2', animalName: 'Daisy', adopterId: 'ad-2', date: '2024-09-10', reasonTagId: 'tag-17', reasonLabel: 'Surrender - Behavioral' },
    ],
    flagged: true,
    createdAt: '2024-03-15', updatedAt: '2024-09-20',
  },
  {
    id: 'ad-3', firstName: 'Nancy', lastName: 'Drew', email: 'ndrew@email.com', phone: '(555) 890-1234',
    structuredNotes: [
      { id: 'sn-4', tagId: 'tag-14', tagLabel: 'Multiple Animals Adopted Quickly', severity: 'warning', date: '2024-10-01', addedBy: 'System' },
    ],
    adoptionHistory: [], returnHistory: [],
    flagged: false,
    createdAt: '2024-07-20', updatedAt: '2024-10-01',
  },
];

export const mockAdoptions: Adoption[] = [
  { id: 'adp-1', animalId: 'a-2', animalName: 'Whiskers', adopterId: 'ad-1', adopterName: 'Rachel Green', date: '2024-10-01', fee: 75, status: 'completed' },
  { id: 'adp-2', animalId: 'a-old-1', animalName: 'Rocky', adopterId: 'ad-2', adopterName: 'Tom Baker', date: '2024-03-20', fee: 150, status: 'returned', returnDate: '2024-05-15', returnReason: 'Surrender - Behavioral' },
  { id: 'adp-3', animalId: 'a-old-2', animalName: 'Daisy', adopterId: 'ad-2', adopterName: 'Tom Baker', date: '2024-07-01', fee: 100, status: 'returned', returnDate: '2024-09-10', returnReason: 'Surrender - Behavioral' },
];

export const mockDashboardStats: DashboardStats = {
  totalPeople: 5,
  totalDonors: 3,
  totalVolunteers: 3,
  totalAnimals: 5,
  availableAnimals: 2,
  adoptionsThisMonth: 1,
  donationsThisMonth: 15320,
  volunteerHoursThisMonth: 48,
  flaggedAdopters: 1,
};
