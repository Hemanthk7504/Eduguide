import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Loader2,
  Sparkles,
  User,
  Globe2,
  MapPin,
  BookOpen,
  Award,
  Home,
  Compass,
  Layers,
  TrendingUp,
} from "lucide-react";
import { createProfile, validateProfile } from "../api/profiles";
import { useAuth } from "../hooks/useAuth";
import { TagInput } from "../components/TagInput";
import { ThemeToggle } from "../components/ThemeToggle";
import { COUNTRIES, ALL_CATEGORIES } from "../lib/countryExams";
import type { StudentProfileCreate } from "../types/api";

const STEPS = [
  { label: "Academics & Target", desc: "Your entrance exam & scores" },
  { label: "Preferences & Budget", desc: "Branch, city & costs" },
  { label: "Background & Aid", desc: "Scholarships & interests" },
] as const;

const initialForm: StudentProfileCreate = {
  full_name: "",
  country: "India",
  state: "Telangana",
  target_degree: "B.Tech / B.E.",
  marks_percentage: undefined,
  entrance_rank: undefined,
  exam_score: undefined,
  exam_type: "TG EAPCET (Telangana EAPCET)",
  category: "OC",
  gender: "",
  preferred_branch: "",
  budget_max: undefined,
  preferred_city: "",
  hostel_required: false,
  annual_income: undefined,
  interests: [],
};

const POPULAR_BRANCHES = [
  "Computer Science & Engineering (CSE)",
  "Artificial Intelligence & Machine Learning (AI/ML)",
  "Electronics & Communication (ECE)",
  "Information Technology (IT)",
  "Data Science",
  "Mechanical Engineering",
];

const POPULAR_CITIES_INDIA = [
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Delhi NCR",
  "Pune",
  "Mumbai",
  "Visakhapatnam",
  "Vijayawada",
];

const POPULAR_CITIES_ABROAD = [
  "New York",
  "San Francisco / Silicon Valley",
  "Boston",
  "Austin",
  "London",
  "Toronto",
  "Berlin",
  "Singapore",
  "Melbourne",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<StudentProfileCreate>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.full_name && !form.full_name) {
      setForm((f) => ({ ...f, full_name: user.full_name }));
    }
  }, [user]);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.name === (form.country || "India")) || COUNTRIES[0];
  }, [form.country]);

  const availableExams = selectedCountry.exams;
  const availableStates = selectedCountry.states || [];
  const availableDegrees = selectedCountry.degrees;
  const currencySymbol = selectedCountry.currencySymbol || "₹";

  function handleCountryChange(countryName: string) {
    const c = COUNTRIES.find((item) => item.name === countryName) || COUNTRIES[0];
    setForm((f) => ({
      ...f,
      country: c.name,
      state: c.states && c.states.length > 0 ? c.states[0] : "",
      target_degree: c.degrees[0],
      exam_type: c.exams[0],
      category: c.name === "India" ? "OC" : "International",
    }));
  }

  function update<K extends keyof StudentProfileCreate>(key: K, value: StudentProfileCreate[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next() {
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const cleanedPayload: StudentProfileCreate = {
        ...form,
        full_name: form.full_name?.trim() || user?.full_name || "Student",
        country: form.country || "India",
        state: form.state || undefined,
        target_degree: form.target_degree || "B.Tech / B.E.",
        exam_type: form.exam_type || undefined,
        category: form.category || undefined,
        gender: form.gender || undefined,
        preferred_branch: form.preferred_branch?.trim() || undefined,
        preferred_city: form.preferred_city?.trim() || undefined,
      };
      const created = await createProfile(cleanedPayload);
      const validated = await validateProfile(created.id);
      const w = validated.normalized_data?.validation_warnings ?? [];
      if (w.length) {
        setWarnings(w);
        setSubmitting(false);
        return;
      }
      navigate(`/dashboard/${created.id}`);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ")
        : typeof detail === "string"
        ? detail
        : "Couldn't save your profile. Please check your inputs.";
      setError(message);
      setSubmitting(false);
    }
  }

  const suggestedCities = form.country === "India" ? POPULAR_CITIES_INDIA : POPULAR_CITIES_ABROAD;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--color-bg)] font-sans">
      {/* Background Decorative Mesh & Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-transparent blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-gradient-to-bl from-violet-600/20 via-cyan-500/10 to-transparent blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.2] dark:opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(var(--color-ink-faint) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 flex h-18 w-full items-center justify-between px-6 lg:px-12 border-b border-[var(--color-border-soft)]/50 backdrop-blur-md">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--color-brand)] to-[var(--color-violet)] text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-[var(--color-ink)]">
              EduGuide <span className="text-[var(--color-brand)]">AI</span>
            </span>
            <p className="text-[11px] text-[var(--color-ink-faint)] leading-none">
              Profile Setup & Evaluation
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/60 px-3 py-1 text-xs font-semibold text-[var(--color-ink-dim)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-brand)]" />
            <span>Step {step + 1} of {STEPS.length}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        
        {/* Modern Stepper */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {STEPS.map((s, i) => (
              <div
                key={s.label}
                className={`relative flex flex-col rounded-2xl border p-3 sm:p-4 transition-all ${
                  i === step
                    ? "border-[var(--color-brand)] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-brand)]/10 ring-1 ring-[var(--color-brand)]/30"
                    : i < step
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-[var(--color-border-soft)] bg-[var(--color-bg-raised)]/50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      i < step
                        ? "bg-emerald-500 text-white"
                        : i === step
                        ? "bg-[var(--color-brand)] text-white shadow-xs"
                        : "bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]"
                    }`}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-[var(--color-ink)] truncate">
                    {s.label}
                  </span>
                </div>
                <p className="mt-1 hidden sm:block text-[11px] text-[var(--color-ink-faint)] truncate pl-8">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-brand)] to-violet-500 transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card Container */}
        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5">
          
          {/* ---------------- STEP 0: Academics & Target ---------------- */}
          {step === 0 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-brand)] dark:text-indigo-300">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Academic Standing</span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                  Target Destination & Entrance Exam
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[var(--color-ink-dim)]">
                  EduGuide matches cutoffs accurately based on your location, rank, and target degree.
                </p>
              </div>

              {/* Mode Selector: India vs International */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[var(--color-surface-2)]/80 p-1.5 border border-[var(--color-border-soft)]">
                <button
                  type="button"
                  onClick={() => handleCountryChange("India")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    form.country === "India"
                      ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-md border border-[var(--color-border)]"
                      : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <span className="text-base">🇮🇳</span>
                  <span>Indian Colleges (EAPCET / JEE)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCountryChange("United States")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    form.country !== "India"
                      ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-md border border-[var(--color-border)]"
                      : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <span className="text-base">🌏</span>
                  <span>Study Abroad (USA, UK, etc.)</span>
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                    Full Name
                  </label>
                  <div className="input-group">
                    <User className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                    <input
                      className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none"
                      value={form.full_name}
                      onChange={(e) => update("full_name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                    Target Country
                  </label>
                  <div className="input-group">
                    <Globe2 className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                    <select
                      className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none cursor-pointer"
                      value={form.country || "India"}
                      onChange={(e) => handleCountryChange(e.target.value)}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name} className="bg-[var(--color-surface)] text-[var(--color-ink)]">
                          {c.name} ({c.defaultCurrency})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* State / Province */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                    {form.country === "India" ? "State / Counselling Authority" : "Target State / Region"}
                  </label>
                  <div className="input-group">
                    <MapPin className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                    <select
                      className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none cursor-pointer"
                      value={form.state || ""}
                      onChange={(e) => update("state", e.target.value)}
                    >
                      {availableStates.map((st) => (
                        <option key={st} value={st} className="bg-[var(--color-surface)] text-[var(--color-ink)]">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Degree */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                    Target Degree
                  </label>
                  <div className="input-group">
                    <BookOpen className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                    <select
                      className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none cursor-pointer"
                      value={form.target_degree || ""}
                      onChange={(e) => update("target_degree", e.target.value)}
                    >
                      {availableDegrees.map((deg) => (
                        <option key={deg} value={deg} className="bg-[var(--color-surface)] text-[var(--color-ink)]">
                          {deg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Entrance Exam */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                    Entrance Exam
                  </label>
                  <div className="input-group">
                    <Award className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                    <select
                      className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none cursor-pointer"
                      value={form.exam_type}
                      onChange={(e) => update("exam_type", e.target.value)}
                    >
                      <option value="" className="bg-[var(--color-surface)]">Select entrance exam</option>
                      {availableExams.map((e) => (
                        <option key={e} value={e} className="bg-[var(--color-surface)] text-[var(--color-ink)]">
                          {e}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rank or Score */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                    {form.country === "India" ? "Entrance Exam Rank" : "Standardized Test Score"}
                  </label>
                  <div className="input-group">
                    <TrendingUp className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                    {form.country === "India" ? (
                      <input
                        type="number"
                        min={1}
                        className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none"
                        value={form.entrance_rank ?? ""}
                        onChange={(e) => update("entrance_rank", numOrUndefined(e.target.value))}
                        placeholder="e.g. 4500 (EAPCET rank)"
                      />
                    ) : (
                      <input
                        type="number"
                        step="any"
                        className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none"
                        value={form.exam_score ?? ""}
                        onChange={(e) => update("exam_score", numOrUndefined(e.target.value))}
                        placeholder="e.g. 1450 (SAT) or 7.5 (IELTS)"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* 12th Marks % */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                    Class 12 / Intermediate Marks (%)
                  </label>
                  <div className="input-group">
                    <Layers className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none"
                      value={form.marks_percentage ?? ""}
                      onChange={(e) => update("marks_percentage", numOrUndefined(e.target.value))}
                      placeholder="e.g. 94.5"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                    Category / Caste Reservation
                  </label>
                  <div className="input-group">
                    <Award className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                    <select
                      className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none cursor-pointer"
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                    >
                      {ALL_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value} className="bg-[var(--color-surface)] text-[var(--color-ink)]">
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- STEP 1: Preferences & Budget ---------------- */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-brand)] dark:text-indigo-300">
                  <Compass className="h-3.5 w-3.5" />
                  <span>College Preferences</span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                  Branch, Location & Budget
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[var(--color-ink-dim)]">
                  Personalize your shortlist to match your career aspirations and financial comfort.
                </p>
              </div>

              {/* Preferred Branch with quick chips */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                  Preferred Branch / Major
                </label>
                <div className="input-group">
                  <Sparkles className="h-4 w-4 shrink-0 text-[var(--color-brand)]" />
                  <input
                    className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none"
                    value={form.preferred_branch}
                    onChange={(e) => update("preferred_branch", e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </div>
                {/* Branch suggestion chips */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {POPULAR_BRANCHES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => update("preferred_branch", b)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                        form.preferred_branch === b
                          ? "bg-[var(--color-brand)] text-white shadow-xs"
                          : "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] hover:bg-[var(--color-border-soft)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      {b.split(" (")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred City with quick chips */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                  Preferred City / Study Region
                </label>
                <div className="input-group">
                  <MapPin className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                  <input
                    className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none"
                    value={form.preferred_city}
                    onChange={(e) => update("preferred_city", e.target.value)}
                    placeholder="e.g. Hyderabad"
                  />
                </div>
                {/* City suggestion chips */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {suggestedCities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => update("preferred_city", c)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                        form.preferred_city === c
                          ? "bg-[var(--color-brand)] text-white shadow-xs"
                          : "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] hover:bg-[var(--color-border-soft)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Fee Budget with dynamic currency */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[var(--color-ink-dim)]">
                    Maximum Annual Tuition Fee Budget ({currencySymbol})
                  </label>
                  <span className="text-[11px] text-[var(--color-ink-faint)]">Optional</span>
                </div>
                <div className="input-group">
                  <span className="font-bold text-sm text-[var(--color-brand)] px-1">{currencySymbol}</span>
                  <input
                    type="number"
                    min={0}
                    className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none"
                    value={form.budget_max ?? ""}
                    onChange={(e) => update("budget_max", numOrUndefined(e.target.value))}
                    placeholder={form.country === "India" ? "e.g. 150000" : "e.g. 35000"}
                  />
                </div>
              </div>

              {/* Hostel Required Toggle Card */}
              <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/60 p-4 transition-all hover:border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-[var(--color-brand)]">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-ink)]">
                      Campus Hostel Accommodation
                    </h4>
                    <p className="text-xs text-[var(--color-ink-dim)]">
                      Filter colleges that provide verified on-campus dorms & food facilities.
                    </p>
                  </div>
                </div>
                <Toggle checked={form.hostel_required} onChange={(v) => update("hostel_required", v)} />
              </div>
            </div>
          )}

          {/* ---------------- STEP 2: Background & Scholarships ---------------- */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Award className="h-3.5 w-3.5" />
                  <span>Scholarship Match Engine</span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                  Background & Financial Aid
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[var(--color-ink-dim)]">
                  EduGuide matches state scholarships, full fee waivers, and international merit fellowships.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Gender */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                    Gender (For Women in Tech & State Aid)
                  </label>
                  <div className="input-group">
                    <User className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                    <select
                      className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none cursor-pointer"
                      value={form.gender}
                      onChange={(e) => update("gender", e.target.value)}
                    >
                      <option value="" className="bg-[var(--color-surface)]">Prefer not to say</option>
                      <option value="female" className="bg-[var(--color-surface)]">Female (Unlocks Women Scholarships)</option>
                      <option value="male" className="bg-[var(--color-surface)]">Male</option>
                      <option value="other" className="bg-[var(--color-surface)]">Other</option>
                    </select>
                  </div>
                </div>

                {/* Annual Income */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[var(--color-ink-dim)]">
                      Annual Family Income ({currencySymbol})
                    </label>
                  </div>
                  <div className="input-group">
                    <span className="font-bold text-sm text-emerald-500 px-1">{currencySymbol}</span>
                    <input
                      type="number"
                      min={0}
                      className="w-full bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none"
                      value={form.annual_income ?? ""}
                      onChange={(e) => update("annual_income", numOrUndefined(e.target.value))}
                      placeholder={form.country === "India" ? "e.g. 250000 (Needed for fee waivers)" : "e.g. 60000"}
                    />
                  </div>
                </div>
              </div>

              {/* Fee Waiver Helper Tag */}
              {form.country === "India" && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                  <Award className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong>Scholarship Tip:</strong> Students in Telangana & Andhra Pradesh with annual income &le; ₹2,00,000 (SC/ST &le; ₹2,50,000) are eligible for 100% full tuition fee reimbursement under state counselling schemes!
                  </span>
                </div>
              )}

              {/* Technical Interests & Goals */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
                  Specialized Interests & Tech Focus Areas
                </label>
                <TagInput
                  value={form.interests}
                  onChange={(tags) => update("interests", tags)}
                  placeholder="Type an interest (e.g. AI, Cyber, Robotics) and press Enter"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Machine Learning", "Robotics", "Cybersecurity", "Cloud Computing", "Fintech", "Bioinformatics"].map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => {
                        if (!form.interests.includes(interest)) {
                          update("interests", [...form.interests, interest]);
                        }
                      }}
                      className="rounded-lg bg-[var(--color-surface-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-border-soft)] hover:text-[var(--color-ink)] transition-all"
                    >
                      + {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Validation Warnings */}
          {warnings.length > 0 && (
            <div className="mt-6 space-y-2 rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20">
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                A few details to double-check:
              </p>
              <ul className="list-inside list-disc space-y-1 text-xs text-[var(--color-ink-dim)]">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
              <button
                type="button"
                className="btn-primary mt-2 text-xs py-2"
                onClick={async () => {
                  const created = await createProfile(form).catch(() => null);
                  if (created) navigate(`/dashboard/${created.id}`);
                }}
              >
                Continue anyway
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mt-6 rounded-2xl border border-[var(--color-agent-red)]/20 bg-[var(--color-agent-red)]/10 p-4 text-xs text-[var(--color-agent-red)]">
              {error}
            </div>
          )}

          {/* Step Navigation Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-[var(--color-border-soft)] pt-5">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="btn-secondary text-xs sm:text-sm disabled:opacity-0"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-[var(--color-brand)] to-violet-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99]"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing cutoffs & matching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Build My Admission & Scholarship Plan</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}

function numOrUndefined(v: string): number | undefined {
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[var(--color-brand)]" : "bg-[var(--color-surface-2)]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
