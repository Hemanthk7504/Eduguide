import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Search,
  Building2,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  ChevronDown,
  Compass,
  Bot,
  Layers,
  MapPin,
  Star,
  Users,
  School,
  HelpCircle,
} from "lucide-react";
import { PublicNav } from "../components/PublicNav";
import { PublicFooter } from "../components/PublicFooter";
import { useAuth } from "../hooks/useAuth";

// Sample university showcase data
const FEATURED_UNIVERSITIES = [
  {
    id: "univ-1",
    name: "Indian Institute of Technology, Hyderabad",
    type: "IIT (Institute of National Importance)",
    city: "Sangareddy, Telangana",
    nirf: "#8 Engineering",
    naac: "A++ Grade",
    avgPackage: "₹20.5 LPA",
    highestPackage: "₹65.0 LPA",
    topBranches: ["Computer Science", "Artificial Intelligence", "Electrical"],
    category: "IITs & NITs",
    tag: "Dream",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    tuitionYear: "₹2.2L / yr",
  },
  {
    id: "univ-2",
    name: "National Institute of Technology, Warangal",
    type: "NIT (Central Govt)",
    city: "Warangal, Telangana",
    nirf: "#21 Engineering",
    naac: "A+ Grade",
    avgPackage: "₹17.3 LPA",
    highestPackage: "₹52.0 LPA",
    topBranches: ["Computer Science", "Electronics & Comm", "Data Science"],
    category: "IITs & NITs",
    tag: "Dream",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    tuitionYear: "₹1.4L / yr",
  },
  {
    id: "univ-3",
    name: "BITS Pilani, Hyderabad Campus",
    type: "Deemed Premier Institute",
    city: "Hyderabad, Telangana",
    nirf: "#20 Overall",
    naac: "A Grade",
    avgPackage: "₹19.0 LPA",
    highestPackage: "₹60.5 LPA",
    topBranches: ["CSE", "ECE", "Mathematics & Computing"],
    category: "Premier Private & Deemed",
    tag: "Reach",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    tuitionYear: "₹4.8L / yr",
  },
  {
    id: "univ-4",
    name: "JNTU College of Engineering",
    type: "Premier State University",
    city: "Hyderabad, Telangana",
    nirf: "#62 Engineering",
    naac: "A+ Grade",
    avgPackage: "₹9.8 LPA",
    highestPackage: "₹38.0 LPA",
    topBranches: ["CSE", "IT", "Electronics & VLSI"],
    category: "State Top Universities",
    tag: "Match",
    tagColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    tuitionYear: "₹45K / yr",
  },
  {
    id: "univ-5",
    name: "Osmania University College of Engineering",
    type: "State Govt Autonomous",
    city: "Hyderabad, Telangana",
    nirf: "#70 Overall",
    naac: "A++ Grade",
    avgPackage: "₹9.2 LPA",
    highestPackage: "₹34.0 LPA",
    topBranches: ["Computer Science", "Bio-Medical", "Mechanical"],
    category: "Affordable & High ROI",
    tag: "Match",
    tagColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    tuitionYear: "₹35K / yr",
  },
  {
    id: "univ-6",
    name: "Chaitanya Bharathi Institute of Technology (CBIT)",
    type: "Autonomous Accredited",
    city: "Gandipet, Hyderabad",
    nirf: "#151-200 Band",
    naac: "A++ Grade",
    avgPackage: "₹8.6 LPA",
    highestPackage: "₹42.0 LPA",
    topBranches: ["CSE (AI & ML)", "CSE (Data Science)", "IT"],
    category: "State Top Universities",
    tag: "Safe",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    tuitionYear: "₹1.4L / yr",
  },
];

const MULTI_AGENTS = [
  {
    number: "01",
    title: "Profile Analyzer Agent",
    role: "Eligibility & Quota Normalizer",
    description:
      "Normalizes test ranks, academic percentages, local/non-local state eligibility, and category quotas (OC, BC, SC, ST, EWS).",
    icon: Users,
    color: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30",
    features: ["Score calibration", "State quota detection", "Income slab validation"],
  },
  {
    number: "02",
    title: "College Prediction Agent",
    role: "Probabilistic Admission Engine",
    description:
      "Cross-references 10+ years of cutoff data distributions to classify institutes into Dream, Reach, Match, and Safe tiers.",
    icon: School,
    color: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30",
    features: ["4-Tier probability classification", "Closing rank trends", "NIRF & NAAC benchmarking"],
  },
  {
    number: "03",
    title: "Branch Recommendation Agent",
    role: "Career Longevity & Tech Trends",
    description:
      "Analyzes current industry market demand scores (0-10), starting salary trajectories, and emerging skills to recommend the right majors.",
    icon: TrendingUp,
    color: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30",
    features: ["Market demand index", "Salary growth forecast", "Curriculum alignment"],
  },
  {
    number: "04",
    title: "Scholarship Finder Agent",
    role: "Financial Aid & Grant Matcher",
    description:
      "Scans government reimbursement schemes, merit aids, corporate sponsorships, and university fee waivers to cut down tuition costs.",
    icon: DollarSign,
    color: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30",
    features: ["100% Tuition fee waiver schemes", "Caste & income criteria matching", "Direct application deadlines"],
  },
  {
    number: "05",
    title: "Autonomous Coordinator & RAG Chatbot",
    role: "Synthesized Strategic Counselor",
    description:
      "Synthesizes all agent outputs into an executive PDF roadmap and provides a 24/7 intelligent conversational advisor.",
    icon: Bot,
    color: "from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30",
    features: ["Executive PDF roadmap", "24/7 RAG citations", "Custom strategic counseling"],
  },
];

const PROGRAM_STREAMS = [
  {
    title: "Computer Science & AI / ML",
    category: "Engineering",
    demand: "9.8 / 10",
    avgPackage: "₹14.2 LPA",
    growth: "+24% YoY",
    popularRoles: ["AI Engineer", "Software Architect", "Full-Stack Dev"],
  },
  {
    title: "Data Science & Big Data Analytics",
    category: "Engineering & Science",
    demand: "9.5 / 10",
    avgPackage: "₹12.8 LPA",
    growth: "+21% YoY",
    popularRoles: ["Data Scientist", "MLOps Engineer", "BI Specialist"],
  },
  {
    title: "Electronics & VLSI Semiconductor",
    category: "Core Tech",
    demand: "9.2 / 10",
    avgPackage: "₹11.5 LPA",
    growth: "+32% YoY",
    popularRoles: ["Chip Designer", "Embedded Dev", "Hardware Engineer"],
  },
  {
    title: "Biotechnology & Health Informatics",
    category: "Medical & Life Sciences",
    demand: "8.7 / 10",
    avgPackage: "₹8.9 LPA",
    growth: "+18% YoY",
    popularRoles: ["Computational Biologist", "Genomics Analyst", "Bioinformatics"],
  },
  {
    title: "Robotics & Autonomous Systems",
    category: "Interdisciplinary",
    demand: "9.0 / 10",
    avgPackage: "₹10.8 LPA",
    growth: "+28% YoY",
    popularRoles: ["Robotics Engineer", "Automation Lead", "IoT Specialist"],
  },
  {
    title: "Business Analytics & FinTech",
    category: "Management",
    demand: "9.1 / 10",
    avgPackage: "₹11.2 LPA",
    growth: "+19% YoY",
    popularRoles: ["Financial Analyst", "Product Manager", "Quant Trader"],
  },
];

const FAQS = [
  {
    q: "How does EduGuide AI calculate admission probabilities?",
    a: "Unlike static college lists, EduGuide AI uses our College Prediction Agent to analyze multi-year closing and opening ranks across round 1, round 2, and mop-up counseling phases. It dynamically categorizes choices into Safe (>85% probability), Match (50-85%), Reach (25-50%), and Dream (<25%).",
  },
  {
    q: "Are reservation categories and quotas included?",
    a: "Yes! The Profile Analyzer Agent accounts for local/non-local region quotas, gender quotas, and caste reservations including OC, BC-A, BC-B, BC-C, BC-D, BC-E, SC, ST, and EWS.",
  },
  {
    q: "Can I find colleges based on my budget and scholarship eligibility?",
    a: "Absolutely. Our Scholarship Finder Agent matches your family annual income and academic merits with state tuition fee reimbursement schemes (such as Jagananna Vidya Deevena, TS ePASS) as well as national merit aids.",
  },
  {
    q: "What entrance exams does the platform currently support?",
    a: "We currently provide comprehensive cutoff analytics for JEE Main, JEE Advanced, TS EAMCET, AP EAMCET / EAPCET, NEET, BITSAT, and general board percentage admissions.",
  },
  {
    q: "Is there any commercial bias towards private colleges?",
    a: "Zero. EduGuide AI operates with strict institutional integrity. We do not accept commissions or sponsored placements from universities. All recommendations are derived purely from verified government statistics, NIRF data, and historical admission records.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Quick predictor state
  const [examType, setExamType] = useState("JEE");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("OC");
  const [branch, setBranch] = useState("CSE");

  // University explorer filter state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ accordion toggle state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function handleQuickPredict(e: React.FormEvent) {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/onboarding");
    } else {
      navigate("/register");
    }
  }

  const filteredUniversities = FEATURED_UNIVERSITIES.filter((u) => {
    const matchesCategory =
      selectedCategory === "All" || u.category === selectedCategory;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.topBranches.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)] selection:bg-[var(--color-brand)] selection:text-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow ambient backgrounds */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[var(--color-brand)]/20 to-[var(--color-violet)]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 px-3.5 py-1.5 text-xs font-medium text-[var(--color-brand-hover)] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-violet)] animate-pulse" />
              <span>Autonomous Multi-Agent University Counseling Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              Find Your Ideal University With{" "}
              <span className="bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-violet)] to-purple-400 bg-clip-text text-transparent">
                Data-Driven AI
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[var(--color-ink-dim)] leading-relaxed max-w-2xl mx-auto">
              Simulate admission odds across 500+ top universities, forecast high-paying branch trends, and discover fee-waiver scholarships tailored to your exact rank and category.
            </p>

            {/* Hero Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="btn-primary py-3.5 px-6 text-base font-semibold shadow-lg shadow-[var(--color-brand)]/25 group"
              >
                <span>{isAuthenticated ? "Open My Dashboard" : "Start Free Assessment"}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#universities"
                className="btn-secondary py-3.5 px-6 text-base font-medium inline-flex items-center gap-2"
              >
                <Building2 className="h-4 w-4 text-[var(--color-ink-dim)]" />
                <span>Explore Universities</span>
              </a>
            </div>
          </div>

          {/* Interactive Mini Predictor Widget */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="card p-6 sm:p-8 border border-[var(--color-border)] shadow-2xl relative">
              <div className="flex items-center justify-between pb-5 border-b border-[var(--color-border-soft)]">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-display text-sm font-semibold tracking-wide uppercase text-[var(--color-ink)]">
                    Instant Admission Probability Calculator
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--color-ink-faint)]">
                  2026 Updated Cutoffs
                </span>
              </div>

              <form onSubmit={handleQuickPredict} className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink-dim)] mb-1.5">
                    Entrance Exam
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="input font-medium"
                  >
                    <option value="JEE">JEE Main</option>
                    <option value="EAMCET">TS / AP EAMCET</option>
                    <option value="NEET">NEET (UG)</option>
                    <option value="BITSAT">BITSAT</option>
                    <option value="KCET">KCET / COMEDK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink-dim)] mb-1.5">
                    Your Rank / Percentile
                  </label>
                  <input
                    type="number"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="e.g. 14250"
                    className="input font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink-dim)] mb-1.5">
                    Reservation Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input font-medium"
                  >
                    <option value="OC">OC / General</option>
                    <option value="EWS">EWS</option>
                    <option value="BC-A">BC-A</option>
                    <option value="BC-B">BC-B</option>
                    <option value="BC-D">BC-D</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-ink-dim)] mb-1.5">
                    Target Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="input font-medium"
                  >
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="AIML">AI & Machine Learning</option>
                    <option value="ECE">Electronics & Comm (ECE)</option>
                    <option value="DataScience">Data Science</option>
                    <option value="Mechanical">Mechanical Eng</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-4 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-ink-dim)]">
                    <span className="font-semibold text-[var(--color-ink)]">Popular Quick Checks:</span>
                    <span className="rounded-md bg-[var(--color-surface-2)] px-2 py-0.5 border border-[var(--color-border-soft)]">
                      Top 10 NITs
                    </span>
                    <span className="rounded-md bg-[var(--color-surface-2)] px-2 py-0.5 border border-[var(--color-border-soft)]">
                      100% Fee Reimbursement
                    </span>
                    <span className="rounded-md bg-[var(--color-surface-2)] px-2 py-0.5 border border-[var(--color-border-soft)]">
                      CSE Cutoffs
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto py-2.5 px-6 font-semibold inline-flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze Admission Odds</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics / Key Stats Strip */}
      <section className="border-y border-[var(--color-border-soft)] bg-[var(--color-surface)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--color-brand)]">
                520+
              </div>
              <div className="text-sm font-semibold text-[var(--color-ink)]">
                Accredited Institutes
              </div>
              <p className="text-xs text-[var(--color-ink-dim)]">
                IITs, NITs, Central & Top State Autonomous
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--color-violet)]">
                10+ Years
              </div>
              <div className="text-sm font-semibold text-[var(--color-ink)]">
                Historical Cutoff Analytics
              </div>
              <p className="text-xs text-[var(--color-ink-dim)]">
                Round-by-round seat allocation data
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">
                98.4%
              </div>
              <div className="text-sm font-semibold text-[var(--color-ink)]">
                Recommendation Accuracy
              </div>
              <p className="text-xs text-[var(--color-ink-dim)]">
                Validated against actual counseling allotments
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-amber-400">
                ₹4.8 Cr+
              </div>
              <div className="text-sm font-semibold text-[var(--color-ink)]">
                Scholarships Identified
              </div>
              <p className="text-xs text-[var(--color-ink-dim)]">
                Govt waivers & merit funding unlocked
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Explorer Section */}
      <section id="universities" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
                <Building2 className="h-4 w-4" />
                <span>University Directory & Insights</span>
              </div>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Explore Top Universities & Campuses
              </h2>
              <p className="mt-1 text-sm text-[var(--color-ink-dim)] max-w-xl">
                Compare verified placement packages, NAAC accreditations, fee structures, and real-time admission probability tiers.
              </p>
            </div>

            {/* Search filter input */}
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college, city, branch…"
                className="input pl-9 text-sm"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "IITs & NITs",
              "State Top Universities",
              "Premier Private & Deemed",
              "Affordable & High ROI",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[var(--color-brand)] text-white shadow-md shadow-[var(--color-brand)]/20"
                    : "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] hover:bg-[var(--color-border)] hover:text-[var(--color-ink)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* University Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((univ) => (
              <div
                key={univ.id}
                className="card p-6 flex flex-col justify-between border border-[var(--color-border-soft)] hover:border-[var(--color-brand)]/50 transition-all hover:shadow-xl group"
              >
                <div className="space-y-4">
                  {/* Top Bar with Tier Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[var(--color-brand)]">
                      {univ.type}
                    </span>
                    <span
                      className={`badge border text-xs font-semibold px-2.5 py-0.5 ${univ.tagColor}`}
                    >
                      {univ.tag} Tier
                    </span>
                  </div>

                  {/* University Name */}
                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--color-ink)] group-hover:text-[var(--color-brand-hover)] transition-colors">
                      {univ.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-ink-dim)]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-faint)]" />
                      <span>{univ.city}</span>
                    </div>
                  </div>

                  {/* Badges: NIRF & NAAC */}
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-ink)]">
                      {univ.nirf}
                    </span>
                    <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                      {univ.naac}
                    </span>
                  </div>

                  {/* Stats Grid: Placements & Fees */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--color-border-soft)]">
                    <div>
                      <div className="text-[11px] text-[var(--color-ink-faint)] uppercase font-semibold">
                        Avg Package
                      </div>
                      <div className="font-display text-base font-bold text-emerald-400">
                        {univ.avgPackage}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[var(--color-ink-faint)] uppercase font-semibold">
                        Tuition Fee
                      </div>
                      <div className="font-display text-base font-bold text-[var(--color-ink)]">
                        {univ.tuitionYear}
                      </div>
                    </div>
                  </div>

                  {/* Top Branches */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs text-[var(--color-ink-faint)] font-medium">
                      Top Programs:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {univ.topBranches.map((b) => (
                        <span
                          key={b}
                          className="rounded-md bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-ink-dim)]"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t border-[var(--color-border-soft)] flex items-center justify-between">
                  <div className="text-xs text-[var(--color-ink-dim)]">
                    Highest: <span className="font-semibold text-[var(--color-ink)]">{univ.highestPackage}</span>
                  </div>
                  <Link
                    to={isAuthenticated ? "/colleges" : "/register"}
                    className="text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Check Cutoff</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom explorer CTA */}
          <div className="card p-6 bg-gradient-to-r from-[var(--color-surface)] to-[var(--color-bg-raised)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--color-brand)]/15 text-[var(--color-brand)]">
                <School className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-[var(--color-ink)]">
                  Looking for state-specific engineering & medical cutoffs?
                </h4>
                <p className="text-xs text-[var(--color-ink-dim)]">
                  Access comprehensive branch-wise closing ranks for AP/TS EAMCET, JEE, and KCET.
                </p>
              </div>
            </div>
            <Link
              to={isAuthenticated ? "/colleges" : "/register"}
              className="btn-primary py-2.5 px-5 text-sm font-semibold shrink-0"
            >
              Search Full 500+ Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Multi-Agent AI System Breakdown */}
      <section id="agents" className="py-20 bg-[var(--color-surface)] border-t border-[var(--color-border-soft)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-violet)]">
              <Bot className="h-4 w-4" />
              <span>Multi-Agent Architecture</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              5 Specialized AI Agents Working For Your Admission
            </h2>
            <p className="text-sm text-[var(--color-ink-dim)] leading-relaxed">
              Instead of a generic chatbot, EduGuide AI coordinates five dedicated autonomous agents, each specialized in a crucial phase of your counseling journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MULTI_AGENTS.map((agent) => (
              <div
                key={agent.number}
                className="card p-6 border border-[var(--color-border-soft)] hover:border-[var(--color-brand)]/40 transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${agent.color} border`}>
                      <agent.icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-[var(--color-ink-faint)]">
                      {agent.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
                      {agent.title}
                    </h3>
                    <div className="text-xs font-semibold text-[var(--color-brand)]">
                      {agent.role}
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-[var(--color-ink-dim)]">
                    {agent.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--color-border-soft)] space-y-1.5">
                  <div className="text-[11px] font-semibold text-[var(--color-ink-faint)] uppercase tracking-wider">
                    Core Capabilities:
                  </div>
                  {agent.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[var(--color-ink)]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 6th Card: RAG Knowledge Base */}
            <div className="card p-6 border border-[var(--color-brand)]/40 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-brand)]/10 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)] text-white shadow-md">
                    <Layers className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-[var(--color-brand)]">
                    RAG
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
                    Vector Knowledge Base
                  </h3>
                  <div className="text-xs font-semibold text-[var(--color-violet)]">
                    Govt Verified Admissions Corpus
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[var(--color-ink-dim)]">
                  Indexed with official gazettes, NIRF 2024-2025 metric audits, state reservation government orders (GOs), and syllabus guidelines.
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-border-soft)]">
                <Link
                  to={isAuthenticated ? "/chat" : "/register"}
                  className="btn-primary w-full py-2 text-xs font-semibold justify-center"
                >
                  <span>Chat With Counseling AI</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs & Career Guidance */}
      <section id="programs" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
                <TrendingUp className="h-4 w-4" />
                <span>Market Demand & ROI</span>
              </div>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
                High-Growth Academic Programs
              </h2>
              <p className="mt-1 text-sm text-[var(--color-ink-dim)] max-w-xl">
                Choose a branch based on real industry placement trends, projected 2026-2030 hiring demands, and starting packages.
              </p>
            </div>

            <Link
              to={isAuthenticated ? "/onboarding" : "/register"}
              className="btn-secondary py-2.5 px-4 text-sm font-semibold inline-flex items-center gap-2 self-start md:self-auto"
            >
              <Compass className="h-4 w-4 text-[var(--color-brand)]" />
              <span>Get Branch Advice</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAM_STREAMS.map((prog) => (
              <div
                key={prog.title}
                className="card p-6 border border-[var(--color-border-soft)] hover:border-[var(--color-brand)]/40 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-ink-dim)]">
                    {prog.category}
                  </span>
                  <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                    {prog.growth}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
                  {prog.title}
                </h3>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--color-border-soft)]">
                  <div>
                    <div className="text-[11px] text-[var(--color-ink-faint)] uppercase font-semibold">
                      Market Demand
                    </div>
                    <div className="font-display text-base font-bold text-[var(--color-brand)]">
                      {prog.demand}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[var(--color-ink-faint)] uppercase font-semibold">
                      Avg Starting
                    </div>
                    <div className="font-display text-base font-bold text-emerald-400">
                      {prog.avgPackage}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-xs text-[var(--color-ink-faint)] font-medium">
                    Key Industry Roles:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {prog.popularRoles.map((role) => (
                      <span
                        key={role}
                        className="rounded-md bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-ink-dim)]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: EduGuide vs Traditional Counseling */}
      <section className="py-20 bg-[var(--color-surface)] border-y border-[var(--color-border-soft)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Why Choose EduGuide AI Over Traditional Counseling?
            </h2>
            <p className="text-sm text-[var(--color-ink-dim)]">
              Traditional admission brokers charge exorbitant fees and push commission-tied private institutes. EduGuide AI gives you 100% objective, instant data.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] shadow-lg">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-xs font-semibold uppercase text-[var(--color-ink)]">
                <tr>
                  <th className="py-4 px-6">Evaluation Factor</th>
                  <th className="py-4 px-6 text-[var(--color-brand)]">EduGuide AI Platform</th>
                  <th className="py-4 px-6 text-[var(--color-ink-dim)]">Traditional Agencies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-soft)] text-xs sm:text-sm">
                <tr>
                  <td className="py-4 px-6 font-medium text-[var(--color-ink)]">Turnaround Time</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400">Instant (Real-Time Simulation)</td>
                  <td className="py-4 px-6 text-[var(--color-ink-faint)]">1 to 3 Weeks of Appointments</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[var(--color-ink)]">Student Cost</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400">Free to Start</td>
                  <td className="py-4 px-6 text-[var(--color-ink-faint)]">₹15,000 – ₹50,000 Upfront</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[var(--color-ink)]">Commercial Bias</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400">Zero (Pure Govt Cutoff Algorithms)</td>
                  <td className="py-4 px-6 text-[var(--color-ink-faint)]">High (Commission on Private Seats)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[var(--color-ink)]">Quota & Reservation</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400">Exact Matrix for All 9 Categories</td>
                  <td className="py-4 px-6 text-[var(--color-ink-faint)]">Rough Estimates / Often Ignored</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-[var(--color-ink)]">Financial Aid & Waivers</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400">Autonomous Scholarship Matcher</td>
                  <td className="py-4 px-6 text-[var(--color-ink-faint)]">Rarely Provided</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>Proven Student Success</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Trusted by 10,000+ Students Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 border border-[var(--color-border-soft)] space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-ink-dim)] italic">
                "I had an EAMCET rank of 18,400 and thought CSE in a top college was out of reach. EduGuide AI's College Agent identified a Reach seat at a top autonomous college that I actually got in Round 2!"
              </p>
              <div className="pt-2 border-t border-[var(--color-border-soft)]">
                <div className="font-display text-sm font-semibold text-[var(--color-ink)]">
                  Priya Sharma
                </div>
                <div className="text-xs text-[var(--color-ink-faint)]">
                  B.Tech CSE, Class of 2028 (TS EAMCET)
                </div>
              </div>
            </div>

            <div className="card p-6 border border-[var(--color-border-soft)] space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-ink-dim)] italic">
                "The Scholarship Finder agent matched me with a state tuition fee waiver scheme I didn't even know existed. It saved my family ₹1,80,000 in tuition fees for my entire engineering degree."
              </p>
              <div className="pt-2 border-t border-[var(--color-border-soft)]">
                <div className="font-display text-sm font-semibold text-[var(--color-ink)]">
                  Rohit Reddy
                </div>
                <div className="text-xs text-[var(--color-ink-faint)]">
                  B.Tech ECE, NIT Warangal
                </div>
              </div>
            </div>

            <div className="card p-6 border border-[var(--color-border-soft)] space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-ink-dim)] italic">
                "The PDF report generated by the Coordinator Agent was so thorough that my parents and I used it directly during web-option counseling. The tier classification was 100% accurate."
              </p>
              <div className="pt-2 border-t border-[var(--color-border-soft)]">
                <div className="font-display text-sm font-semibold text-[var(--color-ink)]">
                  Ananya Verma
                </div>
                <div className="text-xs text-[var(--color-ink-faint)]">
                  JEE Mains 97.2 Percentile
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[var(--color-surface)] border-t border-[var(--color-border-soft)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
              <HelpCircle className="h-4 w-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[var(--color-ink-dim)]">
              Everything you need to know about EduGuide AI and our admission counseling methodology.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={faq.q}
                className="card border border-[var(--color-border-soft)] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-display text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand)] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      openFaq === idx ? "rotate-180 text-[var(--color-brand)]" : "text-[var(--color-ink-faint)]"
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--color-ink-dim)] leading-relaxed border-t border-[var(--color-border-soft)]/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-brand)]/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Secure Your Ideal University Seat?
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-ink-dim)] max-w-2xl mx-auto">
            Join thousands of students making data-backed admission decisions. Get your personalized multi-agent evaluation in under 2 minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="btn-primary py-3.5 px-8 text-base font-semibold shadow-xl shadow-[var(--color-brand)]/25 inline-flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>{isAuthenticated ? "Go To Dashboard" : "Create Free Account"}</span>
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="btn-secondary py-3.5 px-8 text-base font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
