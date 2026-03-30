-- ============================================================
-- Seed data — mirrors src/lib/mock-data.ts
-- Run after applying migrations to populate dev data.
-- Safe to re-run: truncates all tables first.
-- ============================================================

-- ── Clear existing data (CASCADE handles foreign keys) ──────
TRUNCATE tenants CASCADE;
TRUNCATE early_access_requests;

-- ── Tenants ──────────────────────────────────────────────────

insert into tenants (id, name, slug, address, city, state, zip, phone, email, created_at, is_active) values
  ('eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Dickson County Humane Society', 'dickson-county-hs', '410 Eno Rd', 'Dickson', 'TN', '37055', '(615) 446-7867', 'info@dicksonhumane.org', '2024-01-01', true),
  ('47da426a-09f3-4024-bc52-837550902ad3', 'Springfield Humane Society', 'springfield-hs', '500 Animal Shelter Rd', 'Springfield', 'IL', '62701', '(555) 000-1234', 'info@springfieldhumane.org', '2024-06-01', true);

-- ── Users ────────────────────────────────────────────────────

insert into users (id, tenant_id, email, first_name, last_name, role, is_active, created_at, last_login_at) values
  ('9e8f25f6-94ab-4938-ad13-9399babbbc0d', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'admin@dicksonhumane.org', 'Alice', 'Admin', 'admin', true, '2024-01-01', '2024-10-28'),
  ('2e692b1a-b797-4b70-b8b9-9f90464f08b3', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'staff@dicksonhumane.org', 'Bob', 'Staff', 'staff', true, '2024-02-15', '2024-10-27'),
  ('48210a06-e768-4293-be84-37f6e6710279', '47da426a-09f3-4024-bc52-837550902ad3', 'admin@springfieldhumane.org', 'Carol', 'Director', 'admin', true, '2024-06-01', '2024-10-25');

-- ── People ───────────────────────────────────────────────────

insert into people (id, tenant_id, first_name, last_name, email, phone, address, city, state, zip, roles, tags, organization_id, organization_name, created_at, updated_at, total_donations, total_volunteer_hours, is_active) values
  ('01043c9b-e4f2-4183-8c65-37c092130416', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Sarah', 'Johnson', 'sarah.j@email.com', '(555) 123-4567', '123 Oak St', 'Dickson', 'TN', '37055', '["donor","volunteer","adopter"]', '["Major Donor","Monthly Volunteer"]', null, null, '2024-01-10', '2024-09-22', 5200, 48, true),
  ('9ad69d62-fc09-4e8f-ae99-06fc3d341656', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Michael', 'Chen', 'mchen@email.com', '(555) 234-5678', '456 Maple Ave', 'Dickson', 'TN', '37055', '["donor"]', '["Major Donor"]', '460abd3a-96a3-406f-a789-31c809f43f88', 'Chen Technologies', '2024-02-20', '2024-02-20', 12500, 0, true),
  ('25bd7dda-49bd-462b-af85-7debbee79e5f', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Emily', 'Rodriguez', 'emily.r@email.com', '(555) 345-6789', '789 Pine Rd', 'Dickson', 'TN', '37055', '["volunteer"]', '["Monthly Volunteer"]', 'f7f8ab01-91a7-43e2-b601-2ede15c29cf6', 'Dickson County Community Bank', '2024-03-05', '2024-08-01', 350, 120, true),
  ('45fdc2da-d395-4efc-8867-e68790ec80ef', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'James', 'Williams', 'jwilliams@email.com', '(555) 456-7890', null, null, null, null, '["donor"]', '[]', null, null, '2024-04-12', '2024-04-12', 800, 0, true),
  ('94e6806b-d5a3-4304-8e83-b537763c8ba9', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Lisa', 'Park', 'lpark@email.com', '(555) 567-8901', null, null, null, null, '["volunteer","adopter"]', '["Monthly Volunteer"]', null, null, '2024-05-22', '2024-08-15', 0, 64, true);

-- ── Moves ────────────────────────────────────────────────────

insert into moves (id, tenant_id, person_id, from_roles, to_roles, date, trigger) values
  ('afe430ce-94a1-4e31-863e-124fab481f01', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '01043c9b-e4f2-4183-8c65-37c092130416', '[]', '["donor"]', '2024-01-10', 'First donation — $500 to General Fund'),
  ('958ea50a-852c-4f86-a353-a7202b3bf384', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '01043c9b-e4f2-4183-8c65-37c092130416', '["donor"]', '["donor","volunteer"]', '2024-06-15', 'Signed up for weekend adoption events'),
  ('de7c8330-70d8-406c-aa36-d3ee576a34e6', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '01043c9b-e4f2-4183-8c65-37c092130416', '["donor","volunteer"]', '["donor","volunteer","adopter"]', '2024-09-22', 'Adopted Luna (DOG-2024-0067)'),
  ('c73695d6-39ef-4e78-be0f-e334472504e4', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '9ad69d62-fc09-4e8f-ae99-06fc3d341656', '[]', '["donor"]', '2024-02-20', 'First donation — $5,000 to Capital Campaign (via Chen Technologies)'),
  ('bb40da22-b12d-4c80-b8a2-105e6efadb70', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '25bd7dda-49bd-462b-af85-7debbee79e5f', '[]', '["volunteer"]', '2024-03-05', 'Signed up for dog walking shifts'),
  ('27477c9f-c7a4-4ef8-99ed-a54925dccc0d', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '25bd7dda-49bd-462b-af85-7debbee79e5f', '["volunteer"]', '["volunteer","donor"]', '2024-05-10', 'First donation — $350 after 2 months volunteering'),
  ('c228696e-897a-4da4-b846-c05094ed7d24', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '25bd7dda-49bd-462b-af85-7debbee79e5f', '["volunteer","donor"]', '["volunteer"]', '2024-08-01', 'Donor role lapsed — no donations in 90 days'),
  ('03c857bb-b0f8-420e-af85-04385ad47e88', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '45fdc2da-d395-4efc-8867-e68790ec80ef', '[]', '["donor"]', '2024-04-12', 'In-kind donation — 50 lbs dog food'),
  ('e0cafbbf-e209-46d9-a91a-d605596cf53a', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '94e6806b-d5a3-4304-8e83-b537763c8ba9', '[]', '["volunteer"]', '2024-05-22', 'Signed up for front desk shifts'),
  ('9f7937a8-b166-4eab-9f54-515d57616be0', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '94e6806b-d5a3-4304-8e83-b537763c8ba9', '["volunteer"]', '["volunteer","adopter"]', '2024-08-15', 'Adopted Whiskers (CAT-2024-0108)');

-- ── Organizations ────────────────────────────────────────────

insert into organizations (id, tenant_id, name, type, ein, contact_name, contact_email, contact_phone, address, city, state, zip, member_ids, roles, total_donations, total_volunteer_hours, matching_gift_program, match_ratio, tags, notes, created_at, updated_at, is_active) values
  ('460abd3a-96a3-406f-a789-31c809f43f88', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Chen Technologies', 'corporation', '36-1234567', 'Michael Chen', 'mchen@chentech.com', '(555) 234-5678', '100 Tech Parkway', 'Dickson', 'TN', '37055', '["9ad69d62-fc09-4e8f-ae99-06fc3d341656"]', '["donor","sponsor"]', 25000, 0, true, 1.0, '["Major Donor","Corporate Sponsor"]', null, '2024-02-15', '2024-10-20', true),
  ('f7f8ab01-91a7-43e2-b601-2ede15c29cf6', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Dickson County Community Bank', 'corporation', '36-9876543', 'David Park', 'dpark@scbank.com', '(555) 444-5555', '200 Main St', 'Dickson', 'TN', '37055', '["25bd7dda-49bd-462b-af85-7debbee79e5f"]', '["donor","volunteer"]', 10000, 80, true, 0.5, '["Corporate Volunteer"]', null, '2024-01-05', '2024-10-15', true),
  ('d79e04de-0abd-487e-904a-8a8f3b7cdd91', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Paws & Claws Pet Supply', 'small-business', '36-5555555', 'Karen Wright', 'karen@pawsclaws.com', '(555) 666-7777', '50 Commerce Dr', 'Dickson', 'TN', '37055', '[]', '["donor"]', 3200, 0, false, null, '[]', null, '2024-03-20', '2024-09-30', true),
  ('f90f8d66-a4be-4671-8904-5b964634c241', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Heart of Tennessee Foundation', 'foundation', '36-7777777', 'Robert Hall', 'rhall@hoif.org', '(555) 888-9999', '300 Philanthropy Ln', 'Dickson', 'TN', '37055', '[]', '["donor"]', 50000, 0, false, null, '["Major Donor","Grant Funder"]', null, '2024-01-15', '2024-07-01', true);

-- ── Donations ────────────────────────────────────────────────

insert into donations (id, tenant_id, person_id, person_name, organization_id, organization_name, type, amount, description, date, category, hours, item_description, estimated_value, receipt_issued, notes) values
  ('0a4a1e87-b2f9-43b4-b07d-f9af0d85d107',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '01043c9b-e4f2-4183-8c65-37c092130416', 'Sarah Johnson',   null, null, 'monetary', 2500,  'Annual fund donation',             '2024-10-01', 'General Fund',      null, null, null, true, null),
  ('bfbdab62-48d7-4ed9-8dc1-b047933c8a95',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '9ad69d62-fc09-4e8f-ae99-06fc3d341656', 'Michael Chen',     '460abd3a-96a3-406f-a789-31c809f43f88', 'Chen Technologies', 'monetary', 5000,  'Building renovation fund',        '2024-10-05', 'Capital Campaign',  null, null, null, true, null),
  ('a0fefb85-6edd-472e-8023-ff43f61eabe6',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '01043c9b-e4f2-4183-8c65-37c092130416', 'Sarah Johnson',   null, null, 'time',     null,  'Weekend adoption event',           '2024-10-12', 'Events',            8, null, null, false, null),
  ('5a1a18c8-ac1e-40cf-a80f-869be2cf861d',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '25bd7dda-49bd-462b-af85-7debbee79e5f', 'Emily Rodriguez', 'f7f8ab01-91a7-43e2-b601-2ede15c29cf6', 'Dickson County Community Bank', 'time', null, 'Dog walking and socialization', '2024-10-15', 'Animal Care', 16, null, null, false, null),
  ('48bf9bb9-856a-4aa8-af9c-22d970db7ce7',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '45fdc2da-d395-4efc-8867-e68790ec80ef', 'James Williams',  null, null, 'in-kind',  null,  'Pet food donation',                '2024-10-18', 'Supplies',          null, '50 lbs premium dog food', 120, true, null),
  ('08f9f2c3-ffcb-44f1-8690-b1b015b447d5',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', null,  null,               '460abd3a-96a3-406f-a789-31c809f43f88', 'Chen Technologies', 'monetary', 7500,  'Corporate matching gift — year end', '2024-10-20', 'General Fund', null, null, null, true, null),
  ('1df2da73-2f59-46fc-b44a-595e2e6a42de',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '94e6806b-d5a3-4304-8e83-b537763c8ba9', 'Lisa Park',       null, null, 'time',     null,  'Front desk and phone support',     '2024-10-22', 'Administration',    24, null, null, false, null),
  ('1cef798c-5146-4bf6-b083-0100d3c90646',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '01043c9b-e4f2-4183-8c65-37c092130416', 'Sarah Johnson',   null, null, 'in-kind',  null,  'Comfort supplies',                 '2024-10-25', 'Supplies',          null, 'Blankets and towels (20 items)', 200, true, null),
  ('0f2bee07-46bd-41b2-88a1-0673692f7033',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', null,  null,               'd79e04de-0abd-487e-904a-8a8f3b7cdd91', 'Paws & Claws Pet Supply', 'in-kind', null, 'Quarterly supply donation', '2024-10-28', 'Supplies', null, 'Pet food and toys (bulk)', 1800, true, null),
  ('631bc111-1071-4271-a3bd-9a1bba616717', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', null,  null,               'f90f8d66-a4be-4671-8904-5b964634c241', 'Heart of Tennessee Foundation', 'monetary', 25000, 'Annual operating grant', '2024-07-01', 'General Fund', null, null, null, true, null),
  ('64b6d067-30df-4ca4-a020-eddf42c3f021', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', null,  null,               'f7f8ab01-91a7-43e2-b601-2ede15c29cf6', 'Dickson County Community Bank', 'monetary', 10000, 'Shelter renovation sponsorship', '2024-09-15', 'Capital Campaign', null, null, null, true, null);

-- ── Animals ──────────────────────────────────────────────────

insert into animals (id, tenant_id, animal_id, name, species, breed, color, gender, size, age, weight, microchip_id, status, intake_date, intake_type, intake_person_id, intake_person_name, description, medical_notes, tags, photo_url, created_at, updated_at) values
  ('036ab3b6-eb50-495c-a392-aef3138c7534', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'DOG-2024-0042', 'Buddy',    'dog', 'Golden Retriever',    'Golden',      'male',   'large',  '3 years', 65, 'MC-98765', 'available',    '2024-09-01', 'surrender',    '45fdc2da-d395-4efc-8867-e68790ec80ef', 'James Williams', 'Friendly, well-socialized golden retriever. Good with kids and other dogs.', '["Vaccinations up to date","Neutered"]', '["Good with Kids"]', null, '2024-09-01', '2024-09-01'),
  ('a3801464-2ff3-491f-be8f-3c9c7a856bbe', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'CAT-2024-0108', 'Whiskers',  'cat', 'Domestic Shorthair', 'Tabby',       'female', 'small',  '5 years', 9,  null,       'adopted',      '2024-07-15', 'stray',        null,  null,             'Calm and affectionate. Loves lap time. Indoor only recommended.',             '["Spayed","FIV negative","FeLV negative"]', '["Senior"]', null, '2024-07-15', '2024-10-01'),
  ('da091858-4e52-4369-9939-d5df5602fd19', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'DOG-2024-0067', 'Luna',      'dog', 'Labrador Mix',       'Black',       'female', 'medium', '1 year',  45, null,       'available',    '2024-10-05', 'transfer',     null,  null,             'Energetic young lab mix. Needs an active family. Basic obedience trained.',   '["Vaccinations up to date","Spayed","Heartworm negative"]', '[]', null, '2024-10-05', '2024-10-05'),
  ('73736718-0478-46a6-993b-52774655072d', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'CAT-2024-0115', 'Oliver',    'cat', 'Siamese Mix',        'Cream/Brown', 'male',   'medium', '2 years', 11, null,       'medical-hold', '2024-10-10', 'confiscation', null,  null,             'Shy but warming up. Needs a quiet home. May have dental issues.',             '["Needs dental evaluation","Neutered","Underweight - on feeding plan"]', '["Special Needs"]', null, '2024-10-10', '2024-10-10'),
  ('f5efe6d1-05f9-4e36-b998-bf307af7be7e', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'DOG-2024-0089', 'Max',       'dog', 'German Shepherd',    'Black/Tan',   'male',   'large',  '4 years', 80, null,       'foster',       '2024-08-20', 'surrender',    null,  null,             'Loyal and protective. Best as only pet. Experienced owner preferred.',         '["Vaccinations up to date","Neutered","Hip dysplasia - managed"]', '["Special Needs"]', null, '2024-08-20', '2024-09-15');

-- ── Admin Tags ───────────────────────────────────────────────

insert into admin_tags (id, tenant_id, label, category, severity, is_active, created_at) values
  ('95d1d020-cad5-4bb0-b630-426a586ec767',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Repeat Returner',                    'adopter',  'critical', true, '2024-01-01'),
  ('f27fbe36-fc4e-4733-94ac-0dfa149b949b',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Hoarding Concern',                   'adopter',  'critical', true, '2024-01-01'),
  ('c9185168-4ddd-4b7a-8553-b7ceb3632ce3',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Behavioral Issues Reported',         'adopter',  'warning',  true, '2024-01-01'),
  ('e0c22dca-7cdd-4120-b2fd-ecfb8fff8050',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Inadequate Housing',                 'adopter',  'warning',  true, '2024-01-01'),
  ('44922480-c4d8-4db4-b729-1055c7d7871c',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Excellent Adopter',                  'adopter',  'info',     true, '2024-01-01'),
  ('912ac56c-16be-4dee-b97a-9c5bf1967649',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Senior',                             'animal',   null,       true, '2024-01-01'),
  ('1c1fff82-36aa-407b-b2a4-27f7bb05d7a2',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Special Needs',                      'animal',   null,       true, '2024-01-01'),
  ('ae85f9b7-3dfc-4c37-b287-fdda5de5ea15',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Good with Kids',                     'animal',   null,       true, '2024-01-01'),
  ('754c5bda-a390-401a-8283-f80ffc8ebb66',  'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Major Donor',                        'person',   null,       true, '2024-01-01'),
  ('d5a88c26-7a91-4a24-8298-1bc7db0f9459', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Monthly Volunteer',                  'person',   null,       true, '2024-01-01'),
  ('28162161-3931-414b-bb59-e032328fa2ba', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Pet Food',                           'donation', null,       true, '2024-01-01'),
  ('3f2f1075-c10f-4fb4-a652-51454dfbf82c', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Medical Supplies',                   'donation', null,       true, '2024-01-01'),
  ('d1a094ae-9b4e-4114-a3e3-e52bd531ae71', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Animal Not Returned in Good Health', 'adopter',  'critical', true, '2024-01-01'),
  ('916467e1-b906-4d8b-99a3-ac4753b627e9', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Multiple Animals Adopted Quickly',   'adopter',  'warning',  true, '2024-01-01'),
  ('e5253b80-3b46-4892-b8a1-b1d02e6511c9', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Surrender - Moving',                 'alert',    'info',     true, '2024-01-01'),
  ('5d9490ad-4a02-49f7-a80f-76b978056c21', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Surrender - Allergies',              'alert',    'info',     true, '2024-01-01'),
  ('630f94f4-40fa-4bd6-bb31-f1693ea40092', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Surrender - Behavioral',             'alert',    'warning',  true, '2024-01-01');

-- ── Alert Rules ──────────────────────────────────────────────

insert into alert_rules (id, tenant_id, name, description, condition, threshold, severity, is_active) values
  ('dfa2f0c8-9117-47c5-b523-f02d9cb9d554', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Repeat Returner Alert',   'Flag adopters who return 2 or more animals',     'return_count_gte', 2, 'critical', true),
  ('1a39e54b-93fa-4c2d-9e81-74ea7bb30b85', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Quick Adoption Pattern',   'Flag adopters with 3+ adoptions in 6 months',   'return_count_gte', 3, 'warning',  true);

-- ── Adopters ─────────────────────────────────────────────────

insert into adopters (id, tenant_id, first_name, last_name, email, phone, address, city, state, zip, flagged, created_at, updated_at) values
  ('4b936ad6-21fb-4cd9-9879-b940ca67b096', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Rachel', 'Green', 'rgreen@email.com',  '(555) 678-9012', '100 Church St', 'Dickson', 'TN', '37055', false, '2024-06-01', '2024-08-01'),
  ('adbfabe1-4939-4dff-bf9e-d0c357399b8c', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Tom',    'Baker', 'tbaker@email.com',  '(555) 789-0123', '200 Elm St',    'Dickson', 'TN', '37055', true,  '2024-03-15', '2024-09-20'),
  ('1c02c649-26f5-43c7-a55c-0a7e255bc8ee', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'Nancy',  'Drew',  'ndrew@email.com',   '(555) 890-1234', null,            null,      null, null,    false, '2024-07-20', '2024-10-01');

-- ── Structured Notes ─────────────────────────────────────────

insert into structured_notes (id, tenant_id, adopter_id, tag_id, tag_label, severity, date, added_by) values
  ('cebd11bf-706f-4231-99a9-d5d4d16ef401', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '4b936ad6-21fb-4cd9-9879-b940ca67b096', '44922480-c4d8-4db4-b729-1055c7d7871c',  'Excellent Adopter',               'info',     '2024-08-01', 'Admin'),
  ('5d4d167e-c5eb-4d1f-92dd-8121e61797f1', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'adbfabe1-4939-4dff-bf9e-d0c357399b8c', '95d1d020-cad5-4bb0-b630-426a586ec767',  'Repeat Returner',                 'critical', '2024-09-20', 'Admin'),
  ('2c39105c-a7e7-4baf-abba-2989fe05ad3a', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'adbfabe1-4939-4dff-bf9e-d0c357399b8c', 'c9185168-4ddd-4b7a-8553-b7ceb3632ce3',  'Behavioral Issues Reported',      'warning',  '2024-09-20', 'Admin'),
  ('6970d0a0-2339-48fc-98a5-5a4b132d828a', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '1c02c649-26f5-43c7-a55c-0a7e255bc8ee', '916467e1-b906-4d8b-99a3-ac4753b627e9', 'Multiple Animals Adopted Quickly', 'warning', '2024-10-01', 'System');

-- ── Adoptions ────────────────────────────────────────────────

insert into adoptions (id, tenant_id, animal_id, animal_name, adopter_id, adopter_name, date, fee, status, return_date, return_reason) values
  ('a557b61c-80fc-4a91-83b8-b97a0530ad03', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'a3801464-2ff3-491f-be8f-3c9c7a856bbe',     'Whiskers', '4b936ad6-21fb-4cd9-9879-b940ca67b096', 'Rachel Green', '2024-10-01', 75,  'completed', null,         null),
  ('f9eaff68-961a-421a-b595-b8a3a3caf226', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'ff676163-f81a-46ea-ad76-509fe92529ee', 'Rocky',    'adbfabe1-4939-4dff-bf9e-d0c357399b8c', 'Tom Baker',    '2024-03-20', 150, 'returned',  '2024-05-15', 'Surrender - Behavioral'),
  ('97c0baa7-4268-4fdb-a649-7c658a54485b', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'aafae502-7cdb-4716-a9d4-ef168cdd7265', 'Daisy',    'adbfabe1-4939-4dff-bf9e-d0c357399b8c', 'Tom Baker',    '2024-07-01', 100, 'returned',  '2024-09-10', 'Surrender - Behavioral');

-- ── Animal Returns ───────────────────────────────────────────

insert into animal_returns (id, tenant_id, adoption_id, animal_id, animal_name, adopter_id, date, reason_tag_id, reason_label) values
  ('d8067897-6d27-435b-abac-983119fbbc54', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', 'f9eaff68-961a-421a-b595-b8a3a3caf226', 'ff676163-f81a-46ea-ad76-509fe92529ee', 'Rocky', 'adbfabe1-4939-4dff-bf9e-d0c357399b8c', '2024-05-15', '630f94f4-40fa-4bd6-bb31-f1693ea40092', 'Surrender - Behavioral'),
  ('31eb4a6a-a74f-4291-8840-37588d63757b', 'eae04d4f-c772-45f4-9a88-c34e2d590ceb', '97c0baa7-4268-4fdb-a649-7c658a54485b', 'aafae502-7cdb-4716-a9d4-ef168cdd7265', 'Daisy', 'adbfabe1-4939-4dff-bf9e-d0c357399b8c', '2024-09-10', '630f94f4-40fa-4bd6-bb31-f1693ea40092', 'Surrender - Behavioral');
