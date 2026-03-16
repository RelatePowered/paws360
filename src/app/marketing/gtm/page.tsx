'use client';

import Link from 'next/link';
import {
  PawPrint,
  ArrowLeft,
  ArrowRight,
  Target,
  Users,
  Megaphone,
  TrendingUp,
  HandshakeIcon,
  Star,
  CheckCircle2,
  Calendar,
  DollarSign,
  Globe,
  Award,
  Rocket,
  BarChart3,
  Heart,
  Shield,
  Zap,
  Building2,
  MapPin,
} from 'lucide-react';

/* ─── Shared layout pieces ─── */

function PhaseCard({
  phase,
  title,
  timeline,
  color,
  children,
}: {
  phase: string;
  title: string;
  timeline: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border-2 ${color} bg-white overflow-hidden`}>
      <div className={`px-6 py-4 ${color.replace('border', 'bg').replace('-600', '-50').replace('-500', '-50')}`}>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{phase}</p>
        <h3 className="text-xl font-black text-slate-900 mt-1">{title}</h3>
        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><Calendar className="w-3.5 h-3.5" /> {timeline}</p>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Tactic({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="font-semibold text-sm text-slate-900">{title}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function MetricRow({ metric, target }: { metric: string; target: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-700">{metric}</span>
      <span className="text-sm font-bold text-indigo-600">{target}</span>
    </div>
  );
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div className="mb-10">
      <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">{label}</p>
      <h2 className="text-3xl font-black text-slate-900">{title}</h2>
      <p className="text-slate-600 mt-3 max-w-3xl leading-relaxed">{subtitle}</p>
    </div>
  );
}

/* ─── Page ─── */

export default function GtmStrategyPage() {
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
              <span className="font-bold">GTM Strategy</span>
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

      <main className="pt-24 pb-20 px-6 max-w-5xl mx-auto">

        {/* Title Block */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6">
            <Rocket className="w-4 h-4" />
            Go-to-Market Playbook
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            ShelterHub GTM Strategy
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
            A phased go-to-market plan leveraging Dickson County Humane Society as our founding partner
            to build credibility, refine the product, and scale into the $2B+ shelter management market.
          </p>
        </div>

        {/* ────────────────────────────────────── */}
        {/* SECTION 1: Market Context */}
        {/* ────────────────────────────────────── */}
        <section className="mb-20">
          <SectionHeader
            label="Market Context"
            title="The opportunity"
            subtitle="The animal shelter software market is fragmented, underserved, and ripe for disruption. Most shelters operate on legacy systems built 15+ years ago."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-slate-50 text-center">
              <p className="text-4xl font-black text-indigo-600">3,500+</p>
              <p className="text-sm text-slate-600 mt-1">Animal shelters in the US</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 text-center">
              <p className="text-4xl font-black text-indigo-600">6.3M</p>
              <p className="text-sm text-slate-600 mt-1">Animals entering shelters annually</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 text-center">
              <p className="text-4xl font-black text-indigo-600">72%</p>
              <p className="text-sm text-slate-600 mt-1">Using outdated or no software</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold mb-4">Competitive Landscape</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-red-50">
                <p className="font-bold text-red-800 mb-2">Legacy Incumbents (PetPoint, Chameleon)</p>
                <p className="text-red-700">Desktop-first or outdated web UIs. Expensive contracts ($5K-$15K/year). Slow innovation. Complex implementations taking 3-6 months.</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50">
                <p className="font-bold text-amber-800 mb-2">Mid-Market (ShelterLuv, Pawlytics)</p>
                <p className="text-amber-700">Better UX but missing key features (no Asilomar reporting, limited CRM, no moves management). ShelterLuv acquired by PetPoint parent company.</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50">
                <p className="font-bold text-blue-800 mb-2">Free/Open Source (Shelter Manager)</p>
                <p className="text-blue-700">Powerful but requires technical staff to deploy and maintain. No commercial support. Steep learning curve.</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50">
                <p className="font-bold text-green-800 mb-2">ShelterHub (Our Position)</p>
                <p className="text-green-700">Modern, full-featured, affordable. Built-in Asilomar/SAC compliance. CRM with moves management. Multi-tenant. AI-powered social media. Fast onboarding.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────── */}
        {/* SECTION 2: ICP */}
        {/* ────────────────────────────────────── */}
        <section className="mb-20">
          <SectionHeader
            label="Ideal Customer Profile"
            title="Who we sell to first"
            subtitle="Our beachhead market is small-to-mid-size municipal and nonprofit shelters that are currently using spreadsheets, outdated software, or basic free tools."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold">Primary ICP</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Municipal or 501(c)(3) animal shelters</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> 200-2,000 animals per year</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> 2-20 staff members</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Currently on spreadsheets, paper, or outdated software</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Want to report SAC/Asilomar but lack the tooling</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Budget: $1,000-$3,000/year for software</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-bold">Secondary ICP (Phase 3+)</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Multi-shelter organizations and rescue coalitions</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> 2,000-10,000+ animals per year across locations</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> 20-100+ staff, multiple roles and locations</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Need multi-tenant with centralized reporting</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Require SSO, API integrations, custom workflows</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Budget: $5,000-$20,000+/year</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────── */}
        {/* SECTION 3: DCHS Partnership */}
        {/* ────────────────────────────────────── */}
        <section className="mb-20">
          <SectionHeader
            label="Founding Partnership"
            title="Dickson County Humane Society"
            subtitle="DCHS is our founding design partner — the shelter that shaped the product and will anchor our go-to-market credibility."
          />

          <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">DC</div>
              <div>
                <h3 className="text-xl font-black">Dickson County Humane Society</h3>
                <p className="text-sm text-slate-600">410 Eno Rd, Dickson, TN 37055 &middot; (615) 446-7867</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3">Partnership Terms</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> Free Professional plan for the first 12 months</li>
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> Priority feature requests and direct Slack channel</li>
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> Co-branded case study and testimonial rights</li>
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> &ldquo;Founding Partner&rdquo; badge on marketing materials</li>
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> Early access to all new features</li>
                  <li className="flex items-start gap-2"><Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> 50% discount in perpetuity after Year 1</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3">What DCHS Provides</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Real-world production usage and stress testing</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Bi-weekly feedback sessions with staff</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Testimonial and case study participation</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Reference calls with prospective customers</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Introduction to regional shelter network</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Permission to use their data patterns (anonymized) in demos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <h4 className="font-bold mb-4">DCHS Adoption Milestones</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs font-bold text-slate-400 mb-1">Month 1</p>
                <p className="text-sm font-bold text-slate-900">Staff onboarded</p>
                <p className="text-xs text-slate-500">All users active, data migrated</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs font-bold text-slate-400 mb-1">Month 2</p>
                <p className="text-sm font-bold text-slate-900">First SAC submission</p>
                <p className="text-xs text-slate-500">Using ShelterHub export</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs font-bold text-slate-400 mb-1">Month 3</p>
                <p className="text-sm font-bold text-slate-900">Case study published</p>
                <p className="text-xs text-slate-500">Quantified impact metrics</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs font-bold text-slate-400 mb-1">Month 6</p>
                <p className="text-sm font-bold text-slate-900">3 referrals generated</p>
                <p className="text-xs text-slate-500">From DCHS network</p>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────── */}
        {/* SECTION 4: Phased Rollout */}
        {/* ────────────────────────────────────── */}
        <section className="mb-20">
          <SectionHeader
            label="Go-to-Market Phases"
            title="The 18-month playbook"
            subtitle="A disciplined, phased approach that builds on each win. We earn the right to scale by proving value at every stage."
          />

          <div className="space-y-8">
            {/* Phase 1 */}
            <PhaseCard phase="Phase 1" title="Validate & Refine" timeline="Months 1-3" color="border-blue-500">
              <Tactic
                icon={<HandshakeIcon className="w-4 h-4 text-blue-600" />}
                title="DCHS Deep Partnership"
                description="Deploy ShelterHub at DCHS. Conduct weekly check-ins with shelter director and front-desk staff. Capture every friction point. Iterate on the product in real-time based on daily operational use."
              />
              <Tactic
                icon={<BarChart3 className="w-4 h-4 text-blue-600" />}
                title="Establish Success Metrics"
                description="Baseline DCHS operations: time to generate reports (before/after), LRR tracking accuracy, adoption-to-donation conversion rate, Petfinder listing turnaround time, and staff hours saved per week."
              />
              <Tactic
                icon={<Users className="w-4 h-4 text-blue-600" />}
                title="Build 5 Beta Waitlist"
                description="Leverage DCHS intro to Tennessee shelter network. Offer extended free trials (90 days) to 5 additional shelters willing to provide structured feedback. Target a mix of sizes (small rescue, mid-size municipal, foster-based org)."
              />
              <Tactic
                icon={<Award className="w-4 h-4 text-blue-600" />}
                title="DCHS Case Study"
                description="Co-author a case study with DCHS: '3 Systems Replaced, LRR Reporting in One Click.' Quantify time saved, donation conversion rates, and operational improvements. This becomes our top-of-funnel content asset."
              />
            </PhaseCard>

            {/* Phase 2 */}
            <PhaseCard phase="Phase 2" title="Seed & Grow" timeline="Months 4-8" color="border-green-500">
              <Tactic
                icon={<Globe className="w-4 h-4 text-green-600" />}
                title="Content Marketing Engine"
                description="Publish weekly content targeting shelter decision-makers: 'How to Calculate Your Live Release Rate,' 'SAC Reporting: A Step-by-Step Guide,' 'Why Moves Management Matters for Donor Retention.' SEO-optimized for shelter admin search queries."
              />
              <Tactic
                icon={<Megaphone className="w-4 h-4 text-green-600" />}
                title="Conference Circuit"
                description="Attend and present at: ASPCA Annual Conference, Animal Care Expo (HSUS), National Animal Care & Control Association (NACA). Demo booth + speaking slot on 'Modern Shelter Analytics.' Cost: ~$5K per conference."
              />
              <Tactic
                icon={<Heart className="w-4 h-4 text-green-600" />}
                title="Rescue Network Partnerships"
                description="Partner with 2-3 state-level rescue networks to offer ShelterHub as their recommended platform. Provide network-wide pricing and shared onboarding webinars. Each network multiplies reach by 10-50 organizations."
              />
              <Tactic
                icon={<DollarSign className="w-4 h-4 text-green-600" />}
                title="Grant Angle Marketing"
                description="Position SAC reporting as a grant-unlocking feature. 'Your shelter qualifies for national grants — if you can report SAC data. ShelterHub makes it one click.' Target shelters that have been denied grants for lack of data compliance."
              />
              <Tactic
                icon={<Star className="w-4 h-4 text-green-600" />}
                title="Founding Partner Program"
                description="Offer the first 25 paying customers 'Founding Partner' status: 40% lifetime discount, priority support, feature voting rights, and logo on the website. Creates urgency and builds a reference-able customer base quickly."
              />
            </PhaseCard>

            {/* Phase 3 */}
            <PhaseCard phase="Phase 3" title="Scale & Expand" timeline="Months 9-18" color="border-violet-500">
              <Tactic
                icon={<TrendingUp className="w-4 h-4 text-violet-600" />}
                title="Product-Led Growth"
                description="Launch self-serve signup with 30-day free trial. Pre-loaded demo data (anonymized DCHS patterns) so prospects can explore immediately. Automated onboarding emails with module-by-module walkthroughs."
              />
              <Tactic
                icon={<Building2 className="w-4 h-4 text-violet-600" />}
                title="Enterprise / Multi-Tenant Push"
                description="Target humane society networks and municipal animal control departments that manage multiple locations. Lead with multi-tenancy, centralized reporting, and SSO. Aim for 3-5 enterprise deals at $10K+/year."
              />
              <Tactic
                icon={<Zap className="w-4 h-4 text-violet-600" />}
                title="Integration Marketplace"
                description="Build direct API integrations with Petfinder and Adopt-a-Pet (beyond CSV export). Add QuickBooks Online and Stripe for payments. Each integration removes friction and increases switching cost."
              />
              <Tactic
                icon={<MapPin className="w-4 h-4 text-violet-600" />}
                title="Regional Expansion"
                description="Replicate the DCHS playbook in 3-5 new states. Identify one 'anchor shelter' per state, offer founding partner terms, and use them to seed regional adoption. Target: Southeast → Midwest → West Coast."
              />
              <Tactic
                icon={<Shield className="w-4 h-4 text-violet-600" />}
                title="Asilomar Certification Partnership"
                description="Work with Asilomar Accords stakeholders to position ShelterHub as an officially recommended reporting tool. Creates massive credibility moat and organic inbound from shelters seeking compliance."
              />
            </PhaseCard>
          </div>
        </section>

        {/* ────────────────────────────────────── */}
        {/* SECTION 5: Positioning */}
        {/* ────────────────────────────────────── */}
        <section className="mb-20">
          <SectionHeader
            label="Positioning"
            title="How we win the conversation"
            subtitle="Our positioning must be clear, memorable, and differentiated in the first 10 seconds."
          />

          <div className="rounded-2xl border border-slate-200 p-8 mb-8">
            <h3 className="font-bold text-lg mb-6">Positioning Statement</h3>
            <blockquote className="text-xl font-bold text-slate-900 leading-relaxed border-l-4 border-indigo-600 pl-6">
              ShelterHub is the modern, all-in-one shelter management platform that replaces legacy systems
              with a fast, intuitive, and affordable tool. Unlike PetPoint and Chameleon, ShelterHub includes
              Asilomar compliance, SAC grant reporting, donor CRM with moves management, and AI social media
              generation — all on a modern web platform with multi-tenant support.
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50">
              <h4 className="font-bold mb-3">Against Legacy (PetPoint, Chameleon)</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                &ldquo;You shouldn&apos;t need a 6-month implementation and a $15K contract to manage your shelter.
                ShelterHub is live in a day, costs a fraction, and has features they still don&apos;t offer &mdash;
                like SAC reporting and AI social posts.&rdquo;
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50">
              <h4 className="font-bold mb-3">Against Mid-Market (ShelterLuv, Pawlytics)</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                &ldquo;ShelterLuv pioneered modern shelter UX, but they were acquired and innovation slowed.
                ShelterHub picks up where they left off &mdash; with Asilomar reporting, moves management,
                multi-tenancy, and an application pipeline they never built.&rdquo;
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50">
              <h4 className="font-bold mb-3">Against Spreadsheets</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                &ldquo;Your spreadsheets can&apos;t flag a repeat returner, calculate your Live Release Rate,
                or publish animals to Petfinder. ShelterHub can — and it costs less per month than you
                spend on paper for your kennel cards.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────── */}
        {/* SECTION 6: Channels */}
        {/* ────────────────────────────────────── */}
        <section className="mb-20">
          <SectionHeader
            label="Channels"
            title="Where we reach shelter decision-makers"
            subtitle="Shelter directors and operations managers are a tight-knit community. Peer referrals and industry events are the highest-converting channels."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200">
              <h4 className="font-bold mb-3 flex items-center gap-2"><Megaphone className="w-4 h-4 text-indigo-600" /> High-Impact Channels</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                <li><strong>Peer referrals</strong> — Shelter directors trust other shelter directors. Every happy customer = 3 warm intros. Build referral incentives (1 free month per referral).</li>
                <li><strong>Industry conferences</strong> — ASPCA Annual Conference, Animal Care Expo, NACA Training Conference. Demo booths + speaking slots.</li>
                <li><strong>State shelter associations</strong> — Tennessee, Kentucky, Georgia, Alabama, etc. Sponsor newsletters and webinars.</li>
                <li><strong>ASPCA/SAC community</strong> — Shelters reporting to SAC are our highest-intent prospects. They already care about data.</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200">
              <h4 className="font-bold mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-600" /> Supporting Channels</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                <li><strong>SEO/Content</strong> — Target long-tail shelter queries: &ldquo;how to calculate live release rate,&rdquo; &ldquo;shelter animals count reporting tool,&rdquo; &ldquo;petfinder csv upload.&rdquo;</li>
                <li><strong>LinkedIn</strong> — Connect with shelter directors and animal welfare professionals. Share DCHS case study, product updates, and industry insights.</li>
                <li><strong>Facebook Groups</strong> — Shelter operations, animal rescue, and foster network communities. Peer recommendations in these groups drive significant traffic.</li>
                <li><strong>Petfinder/Adopt-a-Pet partnerships</strong> — Co-promote as a recommended management tool that feeds their platforms.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────── */}
        {/* SECTION 7: Pricing Strategy */}
        {/* ────────────────────────────────────── */}
        <section className="mb-20">
          <SectionHeader
            label="Pricing Strategy"
            title="Value-based, mission-friendly"
            subtitle="Priced to be the obvious choice for budget-conscious nonprofits, while capturing full value from larger organizations."
          />

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-4 px-6 font-bold">Plan</th>
                  <th className="text-center py-4 px-6 font-bold">Price</th>
                  <th className="text-center py-4 px-6 font-bold">Target</th>
                  <th className="text-center py-4 px-6 font-bold">Key Differentiator</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100">
                  <td className="py-4 px-6 font-semibold">Starter</td>
                  <td className="py-4 px-6 text-center">$49/mo</td>
                  <td className="py-4 px-6 text-center text-slate-600">Small rescues (&lt;100 animals/yr)</td>
                  <td className="py-4 px-6 text-center text-slate-600">Core ops at 80% less than PetPoint</td>
                </tr>
                <tr className="border-t border-slate-100 bg-indigo-50/50">
                  <td className="py-4 px-6 font-semibold text-indigo-700">Professional</td>
                  <td className="py-4 px-6 text-center font-bold text-indigo-700">$149/mo</td>
                  <td className="py-4 px-6 text-center text-slate-600">Established shelters (100-1K/yr)</td>
                  <td className="py-4 px-6 text-center text-slate-600">Asilomar, SAC, Petfinder, AI posts</td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-4 px-6 font-semibold">Enterprise</td>
                  <td className="py-4 px-6 text-center">Custom ($400+/mo)</td>
                  <td className="py-4 px-6 text-center text-slate-600">Multi-shelter orgs (1K+/yr)</td>
                  <td className="py-4 px-6 text-center text-slate-600">Multi-tenant, SSO, API, dedicated support</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-amber-50 border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-2">Early Adopter Pricing</h4>
            <p className="text-sm text-amber-800">
              First 25 customers receive <strong>Founding Partner</strong> pricing: 40% lifetime discount.
              DCHS receives a free year + 50% in perpetuity. Founding Partners are locked in at their
              introductory rate regardless of future price changes. This creates urgency and builds our
              initial reference customer base rapidly.
            </p>
          </div>
        </section>

        {/* ────────────────────────────────────── */}
        {/* SECTION 8: Success Metrics */}
        {/* ────────────────────────────────────── */}
        <section className="mb-20">
          <SectionHeader
            label="Success Metrics"
            title="How we measure progress"
            subtitle="Clear, time-bound targets for each phase of the GTM."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/50">
              <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Phase 1 (Month 3)
              </h4>
              <MetricRow metric="DCHS fully deployed" target="1 shelter" />
              <MetricRow metric="Beta waitlist signups" target="5 shelters" />
              <MetricRow metric="Case study published" target="1" />
              <MetricRow metric="NPS from DCHS staff" target="50+" />
              <MetricRow metric="Feature completion" target="100% table-stakes" />
            </div>
            <div className="p-6 rounded-2xl border border-green-200 bg-green-50/50">
              <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Phase 2 (Month 8)
              </h4>
              <MetricRow metric="Paying customers" target="25" />
              <MetricRow metric="MRR" target="$3,500" />
              <MetricRow metric="Conference presentations" target="2-3" />
              <MetricRow metric="Network partnerships" target="2" />
              <MetricRow metric="Trial-to-paid conversion" target="30%" />
            </div>
            <div className="p-6 rounded-2xl border border-violet-200 bg-violet-50/50">
              <h4 className="font-bold text-violet-800 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Phase 3 (Month 18)
              </h4>
              <MetricRow metric="Paying customers" target="100+" />
              <MetricRow metric="ARR" target="$150K+" />
              <MetricRow metric="Enterprise deals" target="3-5" />
              <MetricRow metric="States with customers" target="10+" />
              <MetricRow metric="Referral rate" target="40% of new customers" />
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────── */}
        {/* SECTION 9: Risks & Mitigations */}
        {/* ────────────────────────────────────── */}
        <section className="mb-20">
          <SectionHeader
            label="Risks & Mitigations"
            title="What could go wrong"
            subtitle="An honest assessment of risks and our playbook for each."
          />

          <div className="space-y-4">
            {[
              {
                risk: 'Legacy incumbents lower prices to compete',
                mitigation: 'Our cost structure (cloud-native, no field sales) lets us profitably operate at prices they can\'t match. Their product debt is our moat — they can\'t add Asilomar/SAC/moves management without a rewrite.',
              },
              {
                risk: 'Shelters resist switching from familiar tools',
                mitigation: 'Lead with pain points (manual SAC reporting, no Petfinder export, spreadsheet LRR calculations). Offer white-glove migration and 90-day extended trials. DCHS case study proves the switch is painless.',
              },
              {
                risk: 'Budget constraints at nonprofit shelters',
                mitigation: '$49/mo Starter plan is less than most shelters spend on paper and printer ink for kennel cards. Position as a cost savings tool (staff hours saved) not a cost center. Offer annual billing discounts.',
              },
              {
                risk: 'ShelterLuv/PetPoint parent company builds competing features',
                mitigation: 'Speed advantage — we ship features monthly, they ship annually. Multi-tenancy and moves management require architectural changes they can\'t retrofit easily. Build switching costs through deep data relationships.',
              },
              {
                risk: 'Slow initial adoption limits word-of-mouth',
                mitigation: 'Founding Partner program creates 25 incentivized advocates. Conference presence ensures face-to-face credibility. Content marketing provides organic inbound while direct outreach builds pipeline.',
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-red-600">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 mb-1">{item.risk}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.mitigation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ────────────────────────────────────── */}
        {/* Bottom CTA */}
        {/* ────────────────────────────────────── */}
        <div className="p-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-center text-white">
          <h2 className="text-3xl font-black mb-4">Let&apos;s build this together</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            ShelterHub is live, DCHS is on board, and the first 25 Founding Partner slots are open.
            Join us in modernizing how shelters save lives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 transition-colors text-lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/marketing"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl hover:border-white/60 transition-colors text-lg"
            >
              View Landing Page
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-slate-400">
          <p>&copy; 2026 ShelterHub. Confidential — for internal and partner use.</p>
          <div className="flex items-center gap-4">
            <Link href="/marketing" className="hover:text-indigo-600">Home</Link>
            <Link href="/marketing/guide" className="hover:text-indigo-600">Product Guide</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
