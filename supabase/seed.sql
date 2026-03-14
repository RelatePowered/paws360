-- ============================================================
-- Seed data — mirrors src/lib/mock-data.ts
-- Run after applying migrations to populate dev data.
-- ============================================================

-- ── Tenants ──────────────────────────────────────────────────

insert into tenants (id, name, slug, address, city, state, zip, phone, email, created_at, is_active) values
  ('tenant-1', 'Dickson County Humane Society', 'dickson-county-hs', '410 Eno Rd', 'Dickson', 'TN', '37055', '(615) 446-7867', 'info@dicksonhumane.org', '2024-01-01', true),
  ('tenant-2', 'Springfield Humane Society', 'springfield-hs', '500 Animal Shelter Rd', 'Springfield', 'IL', '62701', '(555) 000-1234', 'info@springfieldhumane.org', '2024-06-01', true);

-- ── Users ────────────────────────────────────────────────────

insert into users (id, tenant_id, email, first_name, last_name, role, is_active, created_at, last_login_at) values
  ('user-1', 'tenant-1', 'admin@dicksonhumane.org', 'Alice', 'Admin', 'admin', true, '2024-01-01', '2024-10-28'),
  ('user-2', 'tenant-1', 'staff@dicksonhumane.org', 'Bob', 'Staff', 'staff', true, '2024-02-15', '2024-10-27'),
  ('user-3', 'tenant-2', 'admin@springfieldhumane.org', 'Carol', 'Director', 'admin', true, '2024-06-01', '2024-10-25');

-- ── People ───────────────────────────────────────────────────

insert into people (id, tenant_id, first_name, last_name, email, phone, address, city, state, zip, roles, tags, organization_id, organization_name, created_at, updated_at, total_donations, total_volunteer_hours, is_active) values
  ('p-1', 'tenant-1', 'Sarah', 'Johnson', 'sarah.j@email.com', '(555) 123-4567', '123 Oak St', 'Dickson', 'TN', '37055', '["donor","volunteer","adopter"]', '["Major Donor","Monthly Volunteer"]', null, null, '2024-01-10', '2024-09-22', 5200, 48, true),
  ('p-2', 'tenant-1', 'Michael', 'Chen', 'mchen@email.com', '(555) 234-5678', '456 Maple Ave', 'Dickson', 'TN', '37055', '["donor"]', '["Major Donor"]', 'org-1', 'Chen Technologies', '2024-02-20', '2024-02-20', 12500, 0, true),
  ('p-3', 'tenant-1', 'Emily', 'Rodriguez', 'emily.r@email.com', '(555) 345-6789', '789 Pine Rd', 'Dickson', 'TN', '37055', '["volunteer"]', '["Monthly Volunteer"]', 'org-2', 'Dickson County Community Bank', '2024-03-05', '2024-08-01', 350, 120, true),
  ('p-4', 'tenant-1', 'James', 'Williams', 'jwilliams@email.com', '(555) 456-7890', null, null, null, null, '["donor"]', '[]', null, null, '2024-04-12', '2024-04-12', 800, 0, true),
  ('p-5', 'tenant-1', 'Lisa', 'Park', 'lpark@email.com', '(555) 567-8901', null, null, null, null, '["volunteer","adopter"]', '["Monthly Volunteer"]', null, null, '2024-05-22', '2024-08-15', 0, 64, true);

-- ── Moves ────────────────────────────────────────────────────

insert into moves (id, tenant_id, person_id, from_roles, to_roles, date, trigger) values
  ('m-1a', 'tenant-1', 'p-1', '[]', '["donor"]', '2024-01-10', 'First donation — $500 to General Fund'),
  ('m-1b', 'tenant-1', 'p-1', '["donor"]', '["donor","volunteer"]', '2024-06-15', 'Signed up for weekend adoption events'),
  ('m-1c', 'tenant-1', 'p-1', '["donor","volunteer"]', '["donor","volunteer","adopter"]', '2024-09-22', 'Adopted Luna (DOG-2024-0067)'),
  ('m-2a', 'tenant-1', 'p-2', '[]', '["donor"]', '2024-02-20', 'First donation — $5,000 to Capital Campaign (via Chen Technologies)'),
  ('m-3a', 'tenant-1', 'p-3', '[]', '["volunteer"]', '2024-03-05', 'Signed up for dog walking shifts'),
  ('m-3b', 'tenant-1', 'p-3', '["volunteer"]', '["volunteer","donor"]', '2024-05-10', 'First donation — $350 after 2 months volunteering'),
  ('m-3c', 'tenant-1', 'p-3', '["volunteer","donor"]', '["volunteer"]', '2024-08-01', 'Donor role lapsed — no donations in 90 days'),
  ('m-4a', 'tenant-1', 'p-4', '[]', '["donor"]', '2024-04-12', 'In-kind donation — 50 lbs dog food'),
  ('m-5a', 'tenant-1', 'p-5', '[]', '["volunteer"]', '2024-05-22', 'Signed up for front desk shifts'),
  ('m-5b', 'tenant-1', 'p-5', '["volunteer"]', '["volunteer","adopter"]', '2024-08-15', 'Adopted Whiskers (CAT-2024-0108)');

-- ── Organizations ────────────────────────────────────────────

insert into organizations (id, tenant_id, name, type, ein, contact_name, contact_email, contact_phone, address, city, state, zip, member_ids, roles, total_donations, total_volunteer_hours, matching_gift_program, match_ratio, tags, notes, created_at, updated_at, is_active) values
  ('org-1', 'tenant-1', 'Chen Technologies', 'corporation', '36-1234567', 'Michael Chen', 'mchen@chentech.com', '(555) 234-5678', '100 Tech Parkway', 'Dickson', 'TN', '37055', '["p-2"]', '["donor","sponsor"]', 25000, 0, true, 1.0, '["Major Donor","Corporate Sponsor"]', null, '2024-02-15', '2024-10-20', true),
  ('org-2', 'tenant-1', 'Dickson County Community Bank', 'corporation', '36-9876543', 'David Park', 'dpark@scbank.com', '(555) 444-5555', '200 Main St', 'Dickson', 'TN', '37055', '["p-3"]', '["donor","volunteer"]', 10000, 80, true, 0.5, '["Corporate Volunteer"]', null, '2024-01-05', '2024-10-15', true),
  ('org-3', 'tenant-1', 'Paws & Claws Pet Supply', 'small-business', '36-5555555', 'Karen Wright', 'karen@pawsclaws.com', '(555) 666-7777', '50 Commerce Dr', 'Dickson', 'TN', '37055', '[]', '["donor"]', 3200, 0, false, null, '[]', null, '2024-03-20', '2024-09-30', true),
  ('org-4', 'tenant-1', 'Heart of Tennessee Foundation', 'foundation', '36-7777777', 'Robert Hall', 'rhall@hoif.org', '(555) 888-9999', '300 Philanthropy Ln', 'Dickson', 'TN', '37055', '[]', '["donor"]', 50000, 0, false, null, '["Major Donor","Grant Funder"]', null, '2024-01-15', '2024-07-01', true);

-- ── Donations ────────────────────────────────────────────────

insert into donations (id, tenant_id, person_id, person_name, organization_id, organization_name, type, amount, description, date, category, hours, item_description, estimated_value, receipt_issued, notes) values
  ('d-1',  'tenant-1', 'p-1', 'Sarah Johnson',   null, null, 'monetary', 2500,  'Annual fund donation',             '2024-10-01', 'General Fund',      null, null, null, true, null),
  ('d-2',  'tenant-1', 'p-2', 'Michael Chen',     'org-1', 'Chen Technologies', 'monetary', 5000,  'Building renovation fund',        '2024-10-05', 'Capital Campaign',  null, null, null, true, null),
  ('d-3',  'tenant-1', 'p-1', 'Sarah Johnson',   null, null, 'time',     null,  'Weekend adoption event',           '2024-10-12', 'Events',            8, null, null, false, null),
  ('d-4',  'tenant-1', 'p-3', 'Emily Rodriguez', 'org-2', 'Dickson County Community Bank', 'time', null, 'Dog walking and socialization', '2024-10-15', 'Animal Care', 16, null, null, false, null),
  ('d-5',  'tenant-1', 'p-4', 'James Williams',  null, null, 'in-kind',  null,  'Pet food donation',                '2024-10-18', 'Supplies',          null, '50 lbs premium dog food', 120, true, null),
  ('d-6',  'tenant-1', null,  null,               'org-1', 'Chen Technologies', 'monetary', 7500,  'Corporate matching gift — year end', '2024-10-20', 'General Fund', null, null, null, true, null),
  ('d-7',  'tenant-1', 'p-5', 'Lisa Park',       null, null, 'time',     null,  'Front desk and phone support',     '2024-10-22', 'Administration',    24, null, null, false, null),
  ('d-8',  'tenant-1', 'p-1', 'Sarah Johnson',   null, null, 'in-kind',  null,  'Comfort supplies',                 '2024-10-25', 'Supplies',          null, 'Blankets and towels (20 items)', 200, true, null),
  ('d-9',  'tenant-1', null,  null,               'org-3', 'Paws & Claws Pet Supply', 'in-kind', null, 'Quarterly supply donation', '2024-10-28', 'Supplies', null, 'Pet food and toys (bulk)', 1800, true, null),
  ('d-10', 'tenant-1', null,  null,               'org-4', 'Heart of Tennessee Foundation', 'monetary', 25000, 'Annual operating grant', '2024-07-01', 'General Fund', null, null, null, true, null),
  ('d-11', 'tenant-1', null,  null,               'org-2', 'Dickson County Community Bank', 'monetary', 10000, 'Shelter renovation sponsorship', '2024-09-15', 'Capital Campaign', null, null, null, true, null);

-- ── Animals ──────────────────────────────────────────────────

insert into animals (id, tenant_id, animal_id, name, species, breed, color, gender, size, age, weight, microchip_id, status, intake_date, intake_type, intake_person_id, intake_person_name, description, medical_notes, tags, photo_url, created_at, updated_at) values
  ('a-1', 'tenant-1', 'DOG-2024-0042', 'Buddy',    'dog', 'Golden Retriever',    'Golden',      'male',   'large',  '3 years', 65, 'MC-98765', 'available',    '2024-09-01', 'surrender',    'p-4', 'James Williams', 'Friendly, well-socialized golden retriever. Good with kids and other dogs.', '["Vaccinations up to date","Neutered"]', '["Good with Kids"]', null, '2024-09-01', '2024-09-01'),
  ('a-2', 'tenant-1', 'CAT-2024-0108', 'Whiskers',  'cat', 'Domestic Shorthair', 'Tabby',       'female', 'small',  '5 years', 9,  null,       'adopted',      '2024-07-15', 'stray',        null,  null,             'Calm and affectionate. Loves lap time. Indoor only recommended.',             '["Spayed","FIV negative","FeLV negative"]', '["Senior"]', null, '2024-07-15', '2024-10-01'),
  ('a-3', 'tenant-1', 'DOG-2024-0067', 'Luna',      'dog', 'Labrador Mix',       'Black',       'female', 'medium', '1 year',  45, null,       'available',    '2024-10-05', 'transfer',     null,  null,             'Energetic young lab mix. Needs an active family. Basic obedience trained.',   '["Vaccinations up to date","Spayed","Heartworm negative"]', '[]', null, '2024-10-05', '2024-10-05'),
  ('a-4', 'tenant-1', 'CAT-2024-0115', 'Oliver',    'cat', 'Siamese Mix',        'Cream/Brown', 'male',   'medium', '2 years', 11, null,       'medical-hold', '2024-10-10', 'confiscation', null,  null,             'Shy but warming up. Needs a quiet home. May have dental issues.',             '["Needs dental evaluation","Neutered","Underweight - on feeding plan"]', '["Special Needs"]', null, '2024-10-10', '2024-10-10'),
  ('a-5', 'tenant-1', 'DOG-2024-0089', 'Max',       'dog', 'German Shepherd',    'Black/Tan',   'male',   'large',  '4 years', 80, null,       'foster',       '2024-08-20', 'surrender',    null,  null,             'Loyal and protective. Best as only pet. Experienced owner preferred.',         '["Vaccinations up to date","Neutered","Hip dysplasia - managed"]', '["Special Needs"]', null, '2024-08-20', '2024-09-15');

-- ── Admin Tags ───────────────────────────────────────────────

insert into admin_tags (id, tenant_id, label, category, severity, is_active, created_at) values
  ('tag-1',  'tenant-1', 'Repeat Returner',                    'adopter',  'critical', true, '2024-01-01'),
  ('tag-2',  'tenant-1', 'Hoarding Concern',                   'adopter',  'critical', true, '2024-01-01'),
  ('tag-3',  'tenant-1', 'Behavioral Issues Reported',         'adopter',  'warning',  true, '2024-01-01'),
  ('tag-4',  'tenant-1', 'Inadequate Housing',                 'adopter',  'warning',  true, '2024-01-01'),
  ('tag-5',  'tenant-1', 'Excellent Adopter',                  'adopter',  'info',     true, '2024-01-01'),
  ('tag-6',  'tenant-1', 'Senior',                             'animal',   null,       true, '2024-01-01'),
  ('tag-7',  'tenant-1', 'Special Needs',                      'animal',   null,       true, '2024-01-01'),
  ('tag-8',  'tenant-1', 'Good with Kids',                     'animal',   null,       true, '2024-01-01'),
  ('tag-9',  'tenant-1', 'Major Donor',                        'person',   null,       true, '2024-01-01'),
  ('tag-10', 'tenant-1', 'Monthly Volunteer',                  'person',   null,       true, '2024-01-01'),
  ('tag-11', 'tenant-1', 'Pet Food',                           'donation', null,       true, '2024-01-01'),
  ('tag-12', 'tenant-1', 'Medical Supplies',                   'donation', null,       true, '2024-01-01'),
  ('tag-13', 'tenant-1', 'Animal Not Returned in Good Health', 'adopter',  'critical', true, '2024-01-01'),
  ('tag-14', 'tenant-1', 'Multiple Animals Adopted Quickly',   'adopter',  'warning',  true, '2024-01-01'),
  ('tag-15', 'tenant-1', 'Surrender - Moving',                 'alert',    'info',     true, '2024-01-01'),
  ('tag-16', 'tenant-1', 'Surrender - Allergies',              'alert',    'info',     true, '2024-01-01'),
  ('tag-17', 'tenant-1', 'Surrender - Behavioral',             'alert',    'warning',  true, '2024-01-01');

-- ── Alert Rules ──────────────────────────────────────────────

insert into alert_rules (id, tenant_id, name, description, condition, threshold, severity, is_active) values
  ('rule-1', 'tenant-1', 'Repeat Returner Alert',   'Flag adopters who return 2 or more animals',     'return_count_gte', 2, 'critical', true),
  ('rule-2', 'tenant-1', 'Quick Adoption Pattern',   'Flag adopters with 3+ adoptions in 6 months',   'return_count_gte', 3, 'warning',  true);

-- ── Adopters ─────────────────────────────────────────────────

insert into adopters (id, tenant_id, first_name, last_name, email, phone, address, city, state, zip, flagged, created_at, updated_at) values
  ('ad-1', 'tenant-1', 'Rachel', 'Green', 'rgreen@email.com',  '(555) 678-9012', '100 Church St', 'Dickson', 'TN', '37055', false, '2024-06-01', '2024-08-01'),
  ('ad-2', 'tenant-1', 'Tom',    'Baker', 'tbaker@email.com',  '(555) 789-0123', '200 Elm St',    'Dickson', 'TN', '37055', true,  '2024-03-15', '2024-09-20'),
  ('ad-3', 'tenant-1', 'Nancy',  'Drew',  'ndrew@email.com',   '(555) 890-1234', null,            null,      null, null,    false, '2024-07-20', '2024-10-01');

-- ── Structured Notes ─────────────────────────────────────────

insert into structured_notes (id, tenant_id, adopter_id, tag_id, tag_label, severity, date, added_by) values
  ('sn-1', 'tenant-1', 'ad-1', 'tag-5',  'Excellent Adopter',               'info',     '2024-08-01', 'Admin'),
  ('sn-2', 'tenant-1', 'ad-2', 'tag-1',  'Repeat Returner',                 'critical', '2024-09-20', 'Admin'),
  ('sn-3', 'tenant-1', 'ad-2', 'tag-3',  'Behavioral Issues Reported',      'warning',  '2024-09-20', 'Admin'),
  ('sn-4', 'tenant-1', 'ad-3', 'tag-14', 'Multiple Animals Adopted Quickly', 'warning', '2024-10-01', 'System');

-- ── Adoptions ────────────────────────────────────────────────

insert into adoptions (id, tenant_id, animal_id, animal_name, adopter_id, adopter_name, date, fee, status, return_date, return_reason) values
  ('adp-1', 'tenant-1', 'a-2',     'Whiskers', 'ad-1', 'Rachel Green', '2024-10-01', 75,  'completed', null,         null),
  ('adp-2', 'tenant-1', 'a-old-1', 'Rocky',    'ad-2', 'Tom Baker',    '2024-03-20', 150, 'returned',  '2024-05-15', 'Surrender - Behavioral'),
  ('adp-3', 'tenant-1', 'a-old-2', 'Daisy',    'ad-2', 'Tom Baker',    '2024-07-01', 100, 'returned',  '2024-09-10', 'Surrender - Behavioral');

-- ── Animal Returns ───────────────────────────────────────────

insert into animal_returns (id, tenant_id, adoption_id, animal_id, animal_name, adopter_id, date, reason_tag_id, reason_label) values
  ('ret-1', 'tenant-1', 'adp-2', 'a-old-1', 'Rocky', 'ad-2', '2024-05-15', 'tag-17', 'Surrender - Behavioral'),
  ('ret-2', 'tenant-1', 'adp-3', 'a-old-2', 'Daisy', 'ad-2', '2024-09-10', 'tag-17', 'Surrender - Behavioral');
