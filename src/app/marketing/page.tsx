'use client';

import Link from 'next/link';
import {
  PawPrint,
  Shield,
  Heart,
  Users,
  Home,
  MapPin,
  BarChart3,
  DollarSign,
  Globe,
  Syringe,
  FileSpreadsheet,
  Share2,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Lock,
  Layers,
  ChevronDown,
  ClipboardList,
  TrendingUp,
  Clock,
  Eye,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

/* ─── Reusable Components ─── */

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 leading-tight">Paws360</span>
            <span className="text-[10px] text-slate-500 leading-tight">powered by Relate</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#problem" className="hover:text-indigo-600 transition-colors">The Problem</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors">Sign In</Link>
          <Link
            href="/marketing/early-access"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/25"
          >
            Get a 5-Minute Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function FeatureCard({ icon, title, description, tag }: { icon: React.ReactNode; title: string; description: string; tag?: string }) {
  return (
    <div className="relative p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:shadow-teal-100/50 transition-all group">
      {tag && (
        <span className="absolute -top-3 right-4 px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full">
          {tag}
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-black text-teal-600">{value}</p>
      <p className="text-sm text-slate-500 mt-1 font-medium">{label}</p>
    </div>
  );
}

function ComparisonRow({ feature, us, them }: { feature: string; us: boolean; them: boolean }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-3.5 px-4 text-sm text-slate-700">{feature}</td>
      <td className="py-3.5 px-4 text-center">
        {us ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-slate-300">&mdash;</span>}
      </td>
      <td className="py-3.5 px-4 text-center">
        {them ? <CheckCircle2 className="w-5 h-5 text-slate-400 mx-auto" /> : <span className="text-slate-300">&mdash;</span>}
      </td>
    </tr>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-semibold text-slate-900">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-sm text-slate-600 leading-relaxed">{answer}</p>}
    </div>
  );
}

/* ─── Flow Step ─── */
function FlowStep({ step, label, isLast }: { step: string; label: string; isLast?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
        {step}
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {!isLast && <ArrowRight className="w-4 h-4 text-teal-300 shrink-0 hidden md:block" />}
    </div>
  );
}

/* ─── Page ─── */

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-8">
            <Star className="w-4 h-4" />
            Built for humane societies, shelters, and animal welfare organizations
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            From Intake to Adoption Reports&mdash;<br />
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">All in One Place</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track every animal, service, and outcome without spreadsheets&mdash;and generate
            grant and impact reports in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketing/early-access"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-colors shadow-xl shadow-teal-600/30 text-lg"
            >
              Get a 5-Minute Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-teal-300 hover:text-teal-700 transition-colors text-lg"
            >
              See How It Works
            </a>
          </div>
          <p className="text-sm text-slate-400 mt-6">
            Built for humane societies, shelters, and animal welfare organizations managing real cases and real outcomes.
          </p>
        </div>
      </section>

      {/* ═══ PROBLEM SECTION ═══ */}
      <section id="problem" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">The Problem</p>
            <h2 className="text-4xl font-black">Animal care shouldn&apos;t be slowed down by disconnected systems</h2>
          </div>
          <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            Many humane societies are piecing together spreadsheets, paper forms, intake notes,
            and reporting templates just to manage daily operations. That leads to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200">
              <ClipboardList className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 mb-1">Duplicate data entry</p>
                <p className="text-sm text-slate-600">The same information re-entered across animals, cases, and reports</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200">
              <FileSpreadsheet className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 mb-1">Incomplete records</p>
                <p className="text-sm text-slate-600">Inconsistent data across fragmented systems and spreadsheets</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200">
              <Clock className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 mb-1">Time-consuming reporting</p>
                <p className="text-sm text-slate-600">Hours spent assembling reports for grants and board meetings</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200">
              <Eye className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 mb-1">Limited visibility</p>
                <p className="text-sm text-slate-600">No clear view into outcomes like adoptions, transfers, and returns</p>
              </div>
            </div>
          </div>
          <p className="text-center text-lg font-semibold text-slate-700 mt-12">
            Your team is here to care for animals&mdash;not manage fragmented systems.
          </p>
        </div>
      </section>

      {/* ═══ SOLUTION SECTION ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">The Solution</p>
            <h2 className="text-4xl font-black">One system for your entire animal lifecycle</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              This platform connects every step of your workflow&mdash;so each animal&apos;s journey
              is tracked, organized, and ready for reporting at any time.
            </p>
          </div>
          {/* Visual flow */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <FlowStep step="1" label="Intake" />
            <FlowStep step="2" label="Care & Case Management" />
            <FlowStep step="3" label="Outcomes" />
            <FlowStep step="4" label="Reporting" />
            <FlowStep step="5" label="Grants" isLast />
          </div>
          <p className="text-center text-lg font-semibold text-teal-600">
            Enter information once. Use it everywhere.
          </p>
        </div>
      </section>

      {/* ═══ FEATURES (Reframed as outcomes) ═══ */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">What You Get</p>
            <h2 className="text-4xl font-black">Features that drive outcomes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<PawPrint className="w-6 h-6 text-teal-600" />}
              title="Track every animal from intake to outcome"
              description="Capture intake details, medical notes, behavior observations, and status changes in one place. Every animal's journey is documented from arrival to adoption or transfer."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-teal-600" />}
              title="Keep complete, consistent records"
              description="Ensure every animal's history is accurate and accessible. No more hunting across spreadsheets and paper files for the information you need."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-teal-600" />}
              title="Generate reports in minutes"
              description="Quickly produce reports for grants, board meetings, and compliance&mdash;without manual spreadsheets. SAC-formatted, Asilomar-compliant, and export-ready."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-teal-600" />}
              title="Built-in intelligence"
              description="Summarize case histories, surface trends, and assist with reporting&mdash;without adding extra work. AI that helps you focus on what matters."
            />
          </div>
        </div>
      </section>

      {/* ═══ VALUE / ROI SECTION ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">Impact</p>
            <h2 className="text-4xl font-black">Save time. Improve care. Strengthen funding readiness.</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              Organizations using structured systems like this typically:
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBlock value="50-70%" label="Reduction in reporting time" />
            <StatBlock value="100%" label="Record accuracy across cases" />
            <StatBlock value="Real-time" label="Adoption & outcome visibility" />
            <StatBlock value="More" label="Time for animal care" />
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="py-24 px-6 bg-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-8">
            <Star className="w-4 h-4" />
            Built for Real-World Operations
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-relaxed mb-6">
            Designed by a technology leader focused on solving real operational challenges
          </h2>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto mb-10">
            Helping humane societies manage data, improve outcomes, and stay ready for funding opportunities.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              DC
            </div>
            <div className="text-left">
              <p className="font-bold text-white">Dickson County Humane Society</p>
              <p className="text-teal-200 text-sm">Dickson, Tennessee &middot; Founding Partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">Getting Started</p>
            <h2 className="text-4xl font-black">Get started in days, not months</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-6">
                1
              </div>
              <h3 className="font-bold text-lg mb-3">Set up your intake process</h3>
              <p className="text-sm text-slate-600">Configure your intake process and animal tracking fields to match your workflow.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-6">
                2
              </div>
              <h3 className="font-bold text-lg mb-3">Start managing immediately</h3>
              <p className="text-sm text-slate-600">Begin managing animals, care, and outcomes right away with zero learning curve.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-6">
                3
              </div>
              <h3 className="font-bold text-lg mb-3">Generate reports automatically</h3>
              <p className="text-sm text-slate-600">Produce grant-ready reports and insights automatically from your existing data.</p>
            </div>
          </div>
          <p className="text-center text-lg font-semibold text-slate-600">
            No complex implementation. No bloated systems.
          </p>
        </div>
      </section>

      {/* ═══ FULL FEATURE SET ═══ */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">Complete Platform</p>
            <h2 className="text-4xl font-black">Everything your shelter needs</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Every feature your shelter relies on &mdash; animal management, donor tracking, adoption processing,
              kennel maps, reports &mdash; all in one modern, intuitive platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<PawPrint className="w-6 h-6 text-teal-600" />}
              title="Animal Management"
              description="Full lifecycle tracking from intake to outcome. Species, breed, weight, microchip, Asilomar condition classification, medical notes, kennel assignment, photos, and printable cage cards."
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6 text-teal-600" />}
              title="Adoption Processing"
              description="Complete adoption workflow with adopter profiles, fee tracking, return history monitoring, and flagged-adopter alerts to protect animals from repeat returners."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-teal-600" />}
              title="People & CRM"
              description="Unified database for donors, volunteers, and adopters. Track contact info, engagement history, organization affiliations, and lifetime contribution metrics."
            />
            <FeatureCard
              icon={<DollarSign className="w-6 h-6 text-teal-600" />}
              title="Donation Management"
              description="Track monetary gifts, in-kind donations, and volunteer hours. Category tagging, receipt tracking, matching gift programs, and tax letter generation."
            />
            <FeatureCard
              icon={<MapPin className="w-6 h-6 text-teal-600" />}
              title="Kennel Map"
              description="Visual facility overview with zone-based layout, species assignments, size matching, occupancy tracking, and real-time availability status."
            />
            <FeatureCard
              icon={<Home className="w-6 h-6 text-teal-600" />}
              title="Foster Network"
              description="Manage foster homes with capacity tracking, species and size preferences, placement history, duration calculations, and foster-to-adopt conversion tracking."
            />
            <FeatureCard
              icon={<Syringe className="w-6 h-6 text-teal-600" />}
              title="Medical Records"
              description="Comprehensive medical tracking: vaccinations, surgeries, treatments, exams, medications, and lab tests. Each record linked to its veterinarian with next-due-date scheduling."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-teal-600" />}
              title="Reports & Analytics"
              description="Donation summaries, volunteer hours, animal census, adoption trends, people engagement analysis. Export to CSV, QuickBooks format, or PDF."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-teal-600" />}
              title="Admin & Permissions"
              description="Role-based access control with module-level permissions. Super admin, admin, and staff roles. User management, custom tags, and automated alert rules."
            />
          </div>
        </div>
      </section>

      {/* ═══ DIFFERENTIATORS ═══ */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">Competitive Edge</p>
            <h2 className="text-4xl font-black">What sets Paws360 apart</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Features you won&apos;t find in legacy shelter software &mdash; designed by people
              who understand that modern shelters need more than a database.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-teal-600" />}
              title="Asilomar Live Release Rate"
              description="Industry-standard Asilomar Accords compliance built in. Automatic LRR calculation with the no-kill 90% benchmark indicator, intake condition classification, and save rate tracking."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<FileSpreadsheet className="w-6 h-6 text-teal-600" />}
              title="SAC Grant-Ready Reporting"
              description="Shelter Animals Count reports formatted for ASPCA submission with one click. Species-level intake/outcome matrices and CSV export. SAC compliance qualifies your shelter for national grants."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-teal-600" />}
              title="Moves Management"
              description="Track how relationships evolve over time. See when a volunteer becomes a donor, when a donor adopts, or when engagement lapses. Understand your community pipeline at a glance."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-teal-600" />}
              title="Petfinder & Adopt-a-Pet Export"
              description="One-click CSV export in Petfinder and Adopt-a-Pet formats. Auto-maps species, size, and gender codes. Plus a public API endpoint for embedding adoptable animals on your website."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<DollarSign className="w-6 h-6 text-teal-600" />}
              title="Point-of-Adoption Donations"
              description="Capture donations at the moment of adoption with a checkout-style flow. Suggested amounts ($10, $25, $50, $100) with custom input. Modeled on ShelterLuv's proven 30% conversion rate."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6 text-teal-600" />}
              title="Social Media Post Generator"
              description="Auto-generate platform-optimized adoption posts for Facebook, Instagram, and X/Twitter from animal profiles. Template-based with one-click copy and character count awareness."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6 text-teal-600" />}
              title="Application Pipeline"
              description="Full adoption application workflow: submitted, under review, approved, denied. Housing details, vet references, experience assessment, and staff review notes in one place."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Syringe className="w-6 h-6 text-teal-600" />}
              title="Vaccination Alert Dashboard"
              description="Proactive vaccination tracking surfaces overdue and upcoming vaccinations on the main dashboard. Color-coded urgency levels ensure no animal misses a booster."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-teal-600" />}
              title="True Multi-Tenancy"
              description="Built from day one for organizations running multiple shelters or rescue groups. Tenant isolation with row-level security. Super admins switch between locations instantly."
              tag="Differentiator"
            />
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">Feature Comparison</p>
            <h2 className="text-4xl font-black">Paws360 vs. Legacy Platforms</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">Feature</th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-teal-600">Paws360</th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-slate-500">Legacy Tools</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow feature="Animal lifecycle management" us={true} them={true} />
                <ComparisonRow feature="Donation & volunteer tracking" us={true} them={true} />
                <ComparisonRow feature="Adoption processing" us={true} them={true} />
                <ComparisonRow feature="Kennel map visualization" us={true} them={true} />
                <ComparisonRow feature="Asilomar / Live Release Rate" us={true} them={false} />
                <ComparisonRow feature="SAC grant-ready CSV export" us={true} them={false} />
                <ComparisonRow feature="Moves management (CRM)" us={true} them={false} />
                <ComparisonRow feature="Petfinder / Adopt-a-Pet export" us={true} them={false} />
                <ComparisonRow feature="Point-of-adoption donations" us={true} them={false} />
                <ComparisonRow feature="Social media post generator" us={true} them={false} />
                <ComparisonRow feature="Adoption application pipeline" us={true} them={false} />
                <ComparisonRow feature="Vaccination alert dashboard" us={true} them={false} />
                <ComparisonRow feature="Multi-tenant architecture" us={true} them={false} />
                <ComparisonRow feature="Built-in AI intelligence" us={true} them={false} />
                <ComparisonRow feature="Modern responsive UI" us={true} them={false} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">Simple Pricing</p>
            <h2 className="text-4xl font-black">Simple, transparent pricing</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Accessible for small shelters and scalable for growing organizations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-white">
              <h3 className="font-bold text-lg mb-1">Starter</h3>
              <p className="text-sm text-slate-500 mb-6">For small rescues and fosters</p>
              <p className="text-4xl font-black mb-1">$49<span className="text-lg text-slate-500 font-medium">/mo</span></p>
              <p className="text-xs text-slate-400 mb-8">Up to 100 animals/year</p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Animal management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Adoption processing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Donation tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Basic reports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> 2 staff users</li>
              </ul>
              <Link href="/marketing/early-access" className="block text-center w-full py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 hover:border-teal-300 transition-colors">
                Request Access
              </Link>
            </div>
            {/* Professional */}
            <div className="p-8 rounded-2xl border-2 border-teal-600 bg-white relative shadow-xl shadow-teal-100">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-full">
                Most Popular
              </span>
              <h3 className="font-bold text-lg mb-1">Professional</h3>
              <p className="text-sm text-slate-500 mb-6">For established shelters</p>
              <p className="text-4xl font-black mb-1">$149<span className="text-lg text-slate-500 font-medium">/mo</span></p>
              <p className="text-xs text-slate-400 mb-8">Up to 1,000 animals/year</p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Asilomar &amp; SAC reports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Petfinder / Adopt-a-Pet export</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Adoption applications pipeline</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Foster network management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Kennel map &amp; vaccination alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Social media post generator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> 10 staff users</li>
              </ul>
              <Link href="/marketing/early-access" className="block text-center w-full py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/25">
                Request Access
              </Link>
            </div>
            {/* Enterprise */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-white">
              <h3 className="font-bold text-lg mb-1">Enterprise</h3>
              <p className="text-sm text-slate-500 mb-6">For multi-shelter organizations</p>
              <p className="text-4xl font-black mb-1">Custom</p>
              <p className="text-xs text-slate-400 mb-8">Unlimited animals &amp; tenants</p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Everything in Professional</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Multi-tenant support</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> SSO / SAML integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Custom API integrations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Dedicated support</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Unlimited staff users</li>
              </ul>
              <Link href="/marketing/early-access" className="block text-center w-full py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 hover:border-teal-300 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black">Frequently Asked Questions</h2>
          </div>
          <div>
            <FaqItem
              question="Can I import data from my current system?"
              answer="Yes. Paws360 supports CSV import for animals, people, and donations. Our onboarding team will help map your existing data to Paws360's format, whether you're coming from ShelterLuv, PetPoint, Chameleon, spreadsheets, or any other system."
            />
            <FaqItem
              question="How does the Petfinder / Adopt-a-Pet integration work?"
              answer="Paws360 generates CSV files in the exact format required by Petfinder's Import Tool and Adopt-a-Pet's bulk upload. You download the file and upload it to the respective platform. We auto-map species codes, size categories, gender codes, and special needs flags so you don't have to do any manual formatting."
            />
            <FaqItem
              question="What is the Live Release Rate and why does it matter?"
              answer="The Live Release Rate (LRR) is the Asilomar Accords standard for measuring what percentage of shelter animals leave alive. The no-kill benchmark is 90%. Paws360 automatically calculates this using the official formula (excluding owner-requested euthanasia of unhealthy/untreatable animals), so you always know where you stand."
            />
            <FaqItem
              question="What infrastructure do I need to run ShelterHub?"
              answer="Nothing — Paws360 is a fully hosted cloud platform. We handle the infrastructure, database, backups, and security. Just sign up and start using it. For organizations with specific hosting requirements, we also offer self-hosted deployment options on the Enterprise plan."
            />
            <FaqItem
              question="How does multi-tenancy work?"
              answer="Each shelter or rescue group gets their own isolated tenant. Data is completely separated at the database level with row-level security policies. Super admins can switch between tenants. This is ideal for humane society networks, rescue coalitions, or organizations managing multiple locations."
            />
            <FaqItem
              question="Can I try Paws360 before committing?"
              answer="Absolutely. We're currently onboarding early adopter partners with full access to all features. Request early access and our team will get you set up with a personalized walkthrough."
            />
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">
            Spend less time managing records&mdash;and more time caring for animals
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Join shelters across the country using Paws360 to save more animals,
            raise more funds, and run more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketing/early-access"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-colors shadow-xl shadow-teal-600/30 text-lg"
            >
              Book a Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-teal-300 hover:text-teal-700 transition-colors text-lg"
            >
              See It in Action
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 leading-tight">Paws360</span>
              <span className="text-[9px] text-slate-500 leading-tight">powered by Relate</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#features" className="hover:text-teal-600">Features</a>
            <a href="#how-it-works" className="hover:text-teal-600">How It Works</a>
            <a href="#pricing" className="hover:text-teal-600">Pricing</a>
            <Link href="/login" className="hover:text-teal-600">Sign In</Link>
          </div>
          <p className="text-sm text-slate-400">&copy; 2026 Paws360 by <a href="https://relatepowered.com" className="hover:text-teal-600">Relate</a>. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
