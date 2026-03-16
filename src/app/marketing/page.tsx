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
} from 'lucide-react';
import { useState } from 'react';

/* ─── Reusable Components ─── */

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/marketing" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">ShelterHub</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#differentiators" className="hover:text-indigo-600 transition-colors">Why ShelterHub</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <Link href="/marketing/guide" className="hover:text-indigo-600 transition-colors">Product Guide</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">Sign In</Link>
          <Link
            href="/marketing/early-access"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25"
          >
            Request Early Access
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function FeatureCard({ icon, title, description, tag }: { icon: React.ReactNode; title: string; description: string; tag?: string }) {
  return (
    <div className="relative p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:shadow-indigo-100/50 transition-all group">
      {tag && (
        <span className="absolute -top-3 right-4 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
          {tag}
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
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
      <p className="text-4xl md:text-5xl font-black text-indigo-600">{value}</p>
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

/* ─── Page ─── */

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-8">
            <Star className="w-4 h-4" />
            Trusted by Dickson County Humane Society
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            The shelter platform<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">built for impact</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            ShelterHub replaces spreadsheets, siloed tools, and guesswork with one integrated
            platform. Track every animal, donor, volunteer, and adoption &mdash; from intake to outcome.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketing/early-access"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-600/30 text-lg"
            >
              Request Early Access
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/marketing/guide"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-indigo-300 hover:text-indigo-700 transition-colors text-lg"
            >
              Product Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBlock value="13+" label="Core Modules" />
          <StatBlock value="90%+" label="LRR Benchmark" />
          <StatBlock value="30%" label="Donation Conversion" />
          <StatBlock value="0" label="Spreadsheets Needed" />
        </div>
      </section>

      {/* Table Stakes Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">Everything You Need</p>
            <h2 className="text-4xl font-black">Table-stakes features, reimagined</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Every feature your shelter relies on &mdash; animal management, donor tracking, adoption processing,
              kennel maps, reports &mdash; all in one modern, intuitive platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<PawPrint className="w-6 h-6 text-indigo-600" />}
              title="Animal Management"
              description="Full lifecycle tracking from intake to outcome. Species, breed, weight, microchip, Asilomar condition classification, medical notes, kennel assignment, photos, and printable cage cards."
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6 text-indigo-600" />}
              title="Adoption Processing"
              description="Complete adoption workflow with adopter profiles, fee tracking, return history monitoring, and flagged-adopter alerts to protect animals from repeat returners."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-indigo-600" />}
              title="People & CRM"
              description="Unified database for donors, volunteers, and adopters. Track contact info, engagement history, organization affiliations, and lifetime contribution metrics."
            />
            <FeatureCard
              icon={<DollarSign className="w-6 h-6 text-indigo-600" />}
              title="Donation Management"
              description="Track monetary gifts, in-kind donations, and volunteer hours. Category tagging, receipt tracking, matching gift programs, and tax letter generation."
            />
            <FeatureCard
              icon={<MapPin className="w-6 h-6 text-indigo-600" />}
              title="Kennel Map"
              description="Visual facility overview with zone-based layout, species assignments, size matching, occupancy tracking, and real-time availability status."
            />
            <FeatureCard
              icon={<Home className="w-6 h-6 text-indigo-600" />}
              title="Foster Network"
              description="Manage foster homes with capacity tracking, species and size preferences, placement history, duration calculations, and foster-to-adopt conversion tracking."
            />
            <FeatureCard
              icon={<Syringe className="w-6 h-6 text-indigo-600" />}
              title="Medical Records"
              description="Comprehensive medical tracking: vaccinations, surgeries, treatments, exams, medications, and lab tests. Each record linked to its veterinarian with next-due-date scheduling."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-indigo-600" />}
              title="Reports & Analytics"
              description="Donation summaries, volunteer hours, animal census, adoption trends, people engagement analysis. Export to CSV, QuickBooks format, or PDF."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-indigo-600" />}
              title="Admin & Permissions"
              description="Role-based access control with module-level permissions. Super admin, admin, and staff roles. User management, custom tags, and automated alert rules."
            />
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section id="differentiators" className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">Competitive Edge</p>
            <h2 className="text-4xl font-black">What sets ShelterHub apart</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Features you won&apos;t find in legacy shelter software &mdash; designed by people
              who understand that modern shelters need more than a database.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-indigo-600" />}
              title="Asilomar Live Release Rate"
              description="Industry-standard Asilomar Accords compliance built in. Automatic LRR calculation with the no-kill 90% benchmark indicator, intake condition classification, and save rate tracking."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<FileSpreadsheet className="w-6 h-6 text-indigo-600" />}
              title="SAC Grant-Ready Reporting"
              description="Shelter Animals Count reports formatted for ASPCA submission with one click. Species-level intake/outcome matrices and CSV export. SAC compliance qualifies your shelter for national grants."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-indigo-600" />}
              title="Moves Management"
              description="Track how relationships evolve over time. See when a volunteer becomes a donor, when a donor adopts, or when engagement lapses. Understand your community pipeline at a glance."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-indigo-600" />}
              title="Petfinder & Adopt-a-Pet Export"
              description="One-click CSV export in Petfinder and Adopt-a-Pet formats. Auto-maps species, size, and gender codes. Plus a public API endpoint for embedding adoptable animals on your website."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<DollarSign className="w-6 h-6 text-indigo-600" />}
              title="Point-of-Adoption Donations"
              description="Capture donations at the moment of adoption with a checkout-style flow. Suggested amounts ($10, $25, $50, $100) with custom input. Modeled on ShelterLuv's proven 30% conversion rate."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6 text-indigo-600" />}
              title="Social Media Post Generator"
              description="Auto-generate platform-optimized adoption posts for Facebook, Instagram, and X/Twitter from animal profiles. Template-based with one-click copy and character count awareness."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6 text-indigo-600" />}
              title="Application Pipeline"
              description="Full adoption application workflow: submitted, under review, approved, denied. Housing details, vet references, experience assessment, and staff review notes in one place."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Syringe className="w-6 h-6 text-indigo-600" />}
              title="Vaccination Alert Dashboard"
              description="Proactive vaccination tracking surfaces overdue and upcoming vaccinations on the main dashboard. Color-coded urgency levels ensure no animal misses a booster."
              tag="Differentiator"
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-indigo-600" />}
              title="True Multi-Tenancy"
              description="Built from day one for organizations running multiple shelters or rescue groups. Tenant isolation with row-level security. Super admins switch between locations instantly."
              tag="Differentiator"
            />
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">Feature Comparison</p>
            <h2 className="text-4xl font-black">ShelterHub vs. Legacy Platforms</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-4 px-4 text-sm font-bold text-slate-700">Feature</th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-indigo-600">ShelterHub</th>
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
                <ComparisonRow feature="Dark mode" us={true} them={false} />
                <ComparisonRow feature="Modern responsive UI" us={true} them={false} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonial / Partner */}
      <section className="py-24 px-6 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-8">
            <Star className="w-4 h-4" />
            Early Adopter Partner
          </div>
          <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8">
            &ldquo;ShelterHub replaced three different systems and a folder full of spreadsheets.
            Our Live Release Rate reporting used to take a full day &mdash; now it&apos;s one click.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              DC
            </div>
            <div className="text-left">
              <p className="font-bold text-white">Dickson County Humane Society</p>
              <p className="text-indigo-200 text-sm">Dickson, Tennessee &middot; Founding Partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">Simple Pricing</p>
            <h2 className="text-4xl font-black">Plans that grow with your mission</h2>
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
              <Link href="/marketing/early-access" className="block text-center w-full py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 hover:border-indigo-300 transition-colors">
                Request Early Access
              </Link>
            </div>
            {/* Professional */}
            <div className="p-8 rounded-2xl border-2 border-indigo-600 bg-white relative shadow-xl shadow-indigo-100">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
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
              <Link href="/marketing/early-access" className="block text-center w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25">
                Request Early Access
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
              <Link href="/marketing/early-access" className="block text-center w-full py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 hover:border-indigo-300 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black">Frequently Asked Questions</h2>
          </div>
          <div>
            <FaqItem
              question="Can I import data from my current system?"
              answer="Yes. ShelterHub supports CSV import for animals, people, and donations. Our onboarding team will help map your existing data to ShelterHub's format, whether you're coming from ShelterLuv, PetPoint, Chameleon, spreadsheets, or any other system."
            />
            <FaqItem
              question="How does the Petfinder / Adopt-a-Pet integration work?"
              answer="ShelterHub generates CSV files in the exact format required by Petfinder's Import Tool and Adopt-a-Pet's bulk upload. You download the file and upload it to the respective platform. We auto-map species codes, size categories, gender codes, and special needs flags so you don't have to do any manual formatting."
            />
            <FaqItem
              question="What is the Live Release Rate and why does it matter?"
              answer="The Live Release Rate (LRR) is the Asilomar Accords standard for measuring what percentage of shelter animals leave alive. The no-kill benchmark is 90%. ShelterHub automatically calculates this using the official formula (excluding owner-requested euthanasia of unhealthy/untreatable animals), so you always know where you stand."
            />
            <FaqItem
              question="What infrastructure do I need to run ShelterHub?"
              answer="Nothing — ShelterHub is a fully hosted cloud platform. We handle the infrastructure, database, backups, and security. Just sign up and start using it. For organizations with specific hosting requirements, we also offer self-hosted deployment options on the Enterprise plan."
            />
            <FaqItem
              question="How does multi-tenancy work?"
              answer="Each shelter or rescue group gets their own isolated tenant. Data is completely separated at the database level with row-level security policies. Super admins can switch between tenants. This is ideal for humane society networks, rescue coalitions, or organizations managing multiple locations."
            />
            <FaqItem
              question="Can I try ShelterHub before committing?"
              answer="Absolutely. We're currently onboarding early adopter partners with full access to all features. Request early access and our team will get you set up with a personalized walkthrough."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Ready to modernize your shelter?</h2>
          <p className="text-lg text-slate-600 mb-10">
            Join Dickson County Humane Society and shelters across the country using ShelterHub to save more animals, raise more funds, and run more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketing/early-access"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-600/30 text-lg"
            >
              Request Early Access
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/marketing/guide"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-indigo-300 hover:text-indigo-700 transition-colors text-lg"
            >
              Read the Product Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">ShelterHub</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/marketing/guide" className="hover:text-indigo-600">Product Guide</Link>

            <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
            <Link href="/login" className="hover:text-indigo-600">Sign In</Link>
          </div>
          <p className="text-sm text-slate-400">&copy; 2026 ShelterHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
