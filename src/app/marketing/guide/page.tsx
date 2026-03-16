'use client';

import Link from 'next/link';
import {
  PawPrint,
  ArrowLeft,
  LayoutDashboard,
  Users,
  Heart,
  DollarSign,
  MapPin,
  Home,
  Syringe,
  BarChart3,
  Settings,
  Globe,
  Share2,
  Shield,
  FileSpreadsheet,
  Zap,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

function ModuleSection({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 border-b border-slate-200 last:border-0">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="mt-8 prose prose-slate prose-sm max-w-none">{children}</div>
    </section>
  );
}

function KeyCapability({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-700">
      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
      <span>{text}</span>
    </li>
  );
}

const toc = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'animals', label: 'Animal Management' },
  { id: 'medical', label: 'Medical Records' },
  { id: 'people', label: 'People & CRM' },
  { id: 'adoptions', label: 'Adoptions' },
  { id: 'applications', label: 'Application Pipeline' },
  { id: 'donations', label: 'Donations' },
  { id: 'foster', label: 'Foster Network' },
  { id: 'kennels', label: 'Kennel Map' },
  { id: 'reports', label: 'Reports & Analytics' },
  { id: 'asilomar', label: 'Asilomar / LRR' },
  { id: 'sac', label: 'SAC Reporting' },
  { id: 'export', label: 'Publish Animals' },
  { id: 'social', label: 'Social Media' },
  { id: 'admin', label: 'Admin & Permissions' },
  { id: 'multitenancy', label: 'Multi-Tenancy' },
];

export default function ProductGuidePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/marketing" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">ShelterHub Product Guide</span>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Try It Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <div className="pt-16 flex max-w-7xl mx-auto">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200">
          <nav className="sticky top-20 p-6 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Modules</p>
            {toc.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <ChevronRight className="w-3 h-3" />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 px-6 lg:px-12 py-12 max-w-4xl">
          <div className="mb-12">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">Product Guide</p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Everything in ShelterHub,<br />module by module
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              A comprehensive walkthrough of every feature, workflow, and capability in ShelterHub.
              Use this guide to understand what&apos;s possible and train your team.
            </p>
          </div>

          {/* Modules */}
          <ModuleSection id="dashboard" icon={<LayoutDashboard className="w-6 h-6 text-indigo-600" />} title="Dashboard" subtitle="Your shelter at a glance">
            <p>The dashboard is your command center. At the top, four stat cards surface your most critical KPIs:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Total Animals — current census with count of animals in foster" />
              <KeyCapability text="Live Release Rate — auto-calculated with green/yellow/red threshold coloring (90% = no-kill)" />
              <KeyCapability text="Donations This Month — total monetary value received" />
              <KeyCapability text="Average Length of Stay — mean days from intake to outcome" />
            </ul>
            <p>Below the stats, three dashboard widgets provide actionable intelligence:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Flagged Adopters — adopters with red flags, return history, or staff warnings. Click to review notes and severity." />
              <KeyCapability text="Recent Donations — the latest 5 donations with type badges, donor name, amount, and date." />
              <KeyCapability text="Vaccination Alerts — overdue vaccinations (red) and upcoming within 30 days (yellow), sorted by urgency." />
            </ul>
            <p>The bottom section shows a card grid of all available animals with photos, IDs, breed info, and tags.</p>
          </ModuleSection>

          <ModuleSection id="animals" icon={<PawPrint className="w-6 h-6 text-indigo-600" />} title="Animal Management" subtitle="Full lifecycle, intake to outcome">
            <p>The Animals page is the heart of ShelterHub. It manages every animal from the moment they arrive until their outcome.</p>
            <h3 className="text-base font-bold mt-6 mb-3">Intake</h3>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Capture species, breed, color, gender, size, weight, age, date of birth" />
              <KeyCapability text="Record intake type: stray, owner surrender, transfer, return, or confiscation" />
              <KeyCapability text="Classify health using Asilomar Accords conditions: Healthy, Treatable-Rehabilitable, Treatable-Manageable, Unhealthy-Untreatable" />
              <KeyCapability text="Set altered status (intact, spayed, neutered), microchip ID, kennel location" />
              <KeyCapability text="Upload photos via drag-and-drop (stored in S3)" />
            </ul>
            <h3 className="text-base font-bold mt-6 mb-3">Status Tracking</h3>
            <p>Eight animal statuses with color-coded badges and filter buttons: Intake, Available, Adopted, Foster, Medical Hold, Transferred, Deceased, Euthanized. A summary grid shows counts per status at the top of the page.</p>
            <h3 className="text-base font-bold mt-6 mb-3">Detail Modal</h3>
            <p>Click any animal to open a three-tab detail view:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Details — all animal info, tags, photo, outcome data, and inline social media post generator" />
              <KeyCapability text="Medical Records — complete medical history sorted by date, with type-colored badges" />
              <KeyCapability text="Cage Card — print-ready card (4&quot; wide) with high-contrast layout for posting on kennel doors" />
            </ul>
          </ModuleSection>

          <ModuleSection id="medical" icon={<Syringe className="w-6 h-6 text-indigo-600" />} title="Medical Records" subtitle="Vaccinations, surgeries, treatments, and alerts">
            <p>Every animal has a complete medical history accessible from their detail modal.</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Six record types: Vaccination, Surgery, Treatment, Exam, Medication, Test" />
              <KeyCapability text="Each record includes date, description, veterinarian, notes, and optional next-due date" />
              <KeyCapability text="Vaccination records with next-due dates automatically surface on the Dashboard as alerts" />
              <KeyCapability text="Overdue vaccinations flagged in red; due within 30 days flagged in yellow" />
              <KeyCapability text="Color-coded type badges for quick visual scanning of medical history" />
            </ul>
          </ModuleSection>

          <ModuleSection id="people" icon={<Users className="w-6 h-6 text-indigo-600" />} title="People & CRM" subtitle="Donors, volunteers, adopters — unified">
            <p>ShelterHub treats every contact as a <strong>Person</strong> who can hold multiple roles simultaneously: donor, volunteer, and/or adopter.</p>
            <h3 className="text-base font-bold mt-6 mb-3">Moves Management</h3>
            <p>The standout feature of the People module. Every time a person&apos;s relationship with your shelter changes, ShelterHub records a <strong>Move</strong>:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Track role additions (volunteer → volunteer + donor) and removals (donor lapsed)" />
              <KeyCapability text="Each move records from-roles, to-roles, date, and trigger reason" />
              <KeyCapability text="Visual timeline shows the complete engagement journey for any person" />
              <KeyCapability text="Identify multi-role members (your most engaged supporters)" />
              <KeyCapability text="Detect re-engagement opportunities (people who were once more active)" />
            </ul>
            <h3 className="text-base font-bold mt-6 mb-3">Engagement Metrics</h3>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Lifetime donation total and volunteer hours per person" />
              <KeyCapability text="Months as member and number of role moves (engagement depth)" />
              <KeyCapability text="Organization affiliation for corporate donors/volunteers" />
              <KeyCapability text="Custom tags for segmentation" />
            </ul>
          </ModuleSection>

          <ModuleSection id="adoptions" icon={<Heart className="w-6 h-6 text-indigo-600" />} title="Adoptions" subtitle="From application to forever home">
            <p>The Adoptions module has three tabs: Applications, Adopters, and Adoptions.</p>
            <h3 className="text-base font-bold mt-6 mb-3">Adopter Profiles</h3>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Full contact information and adoption history" />
              <KeyCapability text="Flagged adopter system with structured notes (info, warning, critical)" />
              <KeyCapability text="Return history tracking — repeat returners automatically flagged" />
              <KeyCapability text="Severity-based alert badges visible on dashboard and adoption screens" />
            </ul>
            <h3 className="text-base font-bold mt-6 mb-3">Adoption Records</h3>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Date, animal, adopter, fee, and status tracking (completed, pending, returned)" />
              <KeyCapability text="Return tracking with reason tagging" />
              <KeyCapability text="Point-of-adoption donation prompt (see below)" />
            </ul>
          </ModuleSection>

          <ModuleSection id="applications" icon={<FileSpreadsheet className="w-6 h-6 text-indigo-600" />} title="Application Pipeline" subtitle="Screen applicants before adoption">
            <p>The adoption application pipeline helps your team screen and process adoption requests:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Four-stage workflow: Submitted → Under Review → Approved or Denied" />
              <KeyCapability text="Applicant submits: housing type, yard/fence status, other pets, children, experience, vet reference, motivation" />
              <KeyCapability text="Staff can Begin Review, Approve, or Deny with review notes" />
              <KeyCapability text="Pipeline statistics: new, under review, approved, completed, returned" />
              <KeyCapability text="Full application detail modal for comprehensive review" />
            </ul>
          </ModuleSection>

          <ModuleSection id="donations" icon={<DollarSign className="w-6 h-6 text-indigo-600" />} title="Donations" subtitle="Monetary, in-kind, and volunteer time">
            <p>Track every form of support your shelter receives:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Monetary donations with dollar amounts and receipt tracking" />
              <KeyCapability text="In-kind donations with item descriptions and estimated values" />
              <KeyCapability text="Volunteer time donations with hours logged" />
              <KeyCapability text="Categories: General Fund, Capital Campaign, Supplies, Events, Animal Care, Administration, Medical" />
              <KeyCapability text="Organization-linked donations for corporate tracking" />
              <KeyCapability text="Matching gift program tracking (ratio-based)" />
              <KeyCapability text="Tax letter generation for year-end acknowledgments" />
            </ul>
            <h3 className="text-base font-bold mt-6 mb-3">Point-of-Adoption Donations</h3>
            <p>When staff complete an adoption, a checkout-style modal prompts for an optional donation with suggested amounts ($10, $25, $50, $100) or custom input. Based on ShelterLuv&apos;s data showing a 30% conversion rate at the point of adoption.</p>
          </ModuleSection>

          <ModuleSection id="foster" icon={<Home className="w-6 h-6 text-indigo-600" />} title="Foster Network" subtitle="Capacity, placements, and foster-to-adopt">
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Foster home profiles: contact info, address, capacity, species/size preferences" />
              <KeyCapability text="Capacity tracking: maximum animals vs. current count, full/available indicators" />
              <KeyCapability text="Placement tracking: animal, foster home, start/end dates, duration calculation" />
              <KeyCapability text="Placement statuses: Active, Completed, Foster-to-Adopt" />
              <KeyCapability text="Dashboard stats: active homes, active placements, capacity utilization, foster-to-adopt count" />
              <KeyCapability text="Add foster home modal with full form including preferences" />
            </ul>
          </ModuleSection>

          <ModuleSection id="kennels" icon={<MapPin className="w-6 h-6 text-indigo-600" />} title="Kennel Map" subtitle="Visual facility overview">
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Visual kennel grid grouped by zone (e.g., Dog Wing A, Cat Room, Cat Isolation)" />
              <KeyCapability text="Color-coded occupancy: red border (occupied), green border (available)" />
              <KeyCapability text="Each kennel shows: name, species assignment, size category, current animal, status badge, notes" />
              <KeyCapability text="Capacity dashboard: total, occupied, available, occupancy percentage" />
              <KeyCapability text="Filter by zone and species" />
            </ul>
          </ModuleSection>

          <ModuleSection id="reports" icon={<BarChart3 className="w-6 h-6 text-indigo-600" />} title="Reports & Analytics" subtitle="Eight report types with export">
            <p>The Reports module offers eight distinct reports, each with date range filtering and export capabilities:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Donation Report — monetary, in-kind, volunteer hours; by category breakdown" />
              <KeyCapability text="Volunteer Hours Report — total hours, ranked by volunteer" />
              <KeyCapability text="Animal Census Report — by status and species" />
              <KeyCapability text="Adoption Report — completed, returned, total fees" />
              <KeyCapability text="People & Role Transitions — donor/volunteer/adopter counts, move history" />
              <KeyCapability text="Tax Letters — annual acknowledgment letter generation for donors and organizations" />
              <KeyCapability text="Asilomar / Live Release Rate — see dedicated section below" />
              <KeyCapability text="Shelter Animals Count (SAC) — see dedicated section below" />
            </ul>
            <p>Export formats: CSV, QuickBooks, PDF.</p>
          </ModuleSection>

          <ModuleSection id="asilomar" icon={<Shield className="w-6 h-6 text-indigo-600" />} title="Asilomar / Live Release Rate" subtitle="Industry-standard no-kill metrics">
            <p>ShelterHub implements the <strong>Asilomar Accords</strong> framework used by shelters nationwide:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Live Release Rate (LRR) auto-calculated from outcome data" />
              <KeyCapability text="Formula: Live Outcomes / (Total Outcomes - Owner-Requested Euthanasia of Unhealthy/Untreatable)" />
              <KeyCapability text="No-kill benchmark (90%+) indicator with green/yellow/red color coding" />
              <KeyCapability text="Save Rate percentage (not euthanized out of total outcomes)" />
              <KeyCapability text="Intake condition bar charts: Healthy, Treatable-Rehab, Treatable-Manage, Unhealthy-Untreatable" />
              <KeyCapability text="Formula breakdown showing actual numbers for transparency" />
            </ul>
          </ModuleSection>

          <ModuleSection id="sac" icon={<FileSpreadsheet className="w-6 h-6 text-indigo-600" />} title="SAC Reporting" subtitle="ASPCA grant-qualifying data">
            <p>The Shelter Animals Count report generates the monthly intake/outcome matrix required by the ASPCA:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Species-level breakdown (Dog, Cat, Bird, Rabbit, Other)" />
              <KeyCapability text="Intake columns: Stray, Surrender, Transfer, Other, Total" />
              <KeyCapability text="Outcome columns: Adoption, Return to Owner, Transfer Out, Euthanasia, Died in Care, Other, Total" />
              <KeyCapability text="Totals row aggregating across all species" />
              <KeyCapability text="One-click CSV export formatted for ASPCA submission" />
              <KeyCapability text="SAC compliance qualifies shelters for national animal welfare grants" />
            </ul>
          </ModuleSection>

          <ModuleSection id="export" icon={<Globe className="w-6 h-6 text-indigo-600" />} title="Publish Animals" subtitle="Petfinder, Adopt-a-Pet, and API">
            <p>Get your available animals in front of adopters across the internet:</p>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Petfinder CSV Export — compatible with Petfinder's Import Tool, auto-maps species/size/gender codes" />
              <KeyCapability text="Adopt-a-Pet CSV Export — compatible with bulk upload, includes spay/neuter and special needs flags" />
              <KeyCapability text="Public API endpoint (/api/animals/available) for custom website widgets" />
              <KeyCapability text="Preview all exportable animals before downloading" />
              <KeyCapability text="Only animals with 'available' status are included" />
            </ul>
          </ModuleSection>

          <ModuleSection id="social" icon={<Share2 className="w-6 h-6 text-indigo-600" />} title="Social Media" subtitle="AI-generated adoption posts">
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Select any available animal to generate adoption promotion posts" />
              <KeyCapability text="Platform-optimized posts for Facebook, Instagram, and X/Twitter" />
              <KeyCapability text="Twitter character count awareness (280 limit)" />
              <KeyCapability text="One-click copy to clipboard" />
              <KeyCapability text="Regenerate individual platform posts or all at once" />
              <KeyCapability text="Also accessible inline from any animal's detail modal" />
            </ul>
          </ModuleSection>

          <ModuleSection id="admin" icon={<Settings className="w-6 h-6 text-indigo-600" />} title="Admin & Permissions" subtitle="Users, tags, and alert rules">
            <h3 className="text-base font-bold mt-2 mb-3">User Management</h3>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Three role tiers: Super Admin, Admin, Staff" />
              <KeyCapability text="Module-level permissions: none, view, edit — for each of 10 modules" />
              <KeyCapability text="Invite users by email with role assignment" />
              <KeyCapability text="Active/disabled toggle, last login tracking" />
            </ul>
            <h3 className="text-base font-bold mt-6 mb-3">Tags</h3>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Custom tags across categories: person, animal, adopter, donation, alert" />
              <KeyCapability text="Severity levels for adopter/alert tags: info, warning, critical" />
              <KeyCapability text="Filter and manage by category" />
            </ul>
            <h3 className="text-base font-bold mt-6 mb-3">Alert Rules</h3>
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Automated rules: flag adopters with N+ returns, note severity triggers" />
              <KeyCapability text="Configurable thresholds and severity levels" />
              <KeyCapability text="Enable/disable per rule" />
            </ul>
          </ModuleSection>

          <ModuleSection id="multitenancy" icon={<Zap className="w-6 h-6 text-indigo-600" />} title="Multi-Tenancy" subtitle="Multiple shelters, one platform">
            <ul className="space-y-2 my-4 list-none pl-0">
              <KeyCapability text="Each shelter or rescue gets an isolated tenant with its own data" />
              <KeyCapability text="Row-level security (RLS) ensures complete data separation at the database layer" />
              <KeyCapability text="Super admins can switch between tenants instantly" />
              <KeyCapability text="Tenant profile: name, address, phone, email" />
              <KeyCapability text="Ideal for humane society networks, rescue coalitions, or multi-location organizations" />
              <KeyCapability text="Supabase Auth integration with email and optional SSO" />
            </ul>
          </ModuleSection>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl bg-indigo-50 text-center">
            <h2 className="text-2xl font-black mb-3">Ready to see it in action?</h2>
            <p className="text-slate-600 mb-6">Start your 30-day free trial. No credit card required.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/marketing/gtm"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-indigo-300 transition-colors"
              >
                View GTM Strategy
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
