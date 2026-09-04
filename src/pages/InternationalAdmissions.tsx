import { useMemo, useState } from "react";
import {
  Globe2,
  Search,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import {
  INTERNATIONAL_COLLEGES,
  type InternationalCollege,
} from "../lib/internationalColleges";

const COUNTRIES = [
  { name: "All Countries", flag: "🌍" },
  { name: "United States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Ireland", flag: "🇮🇪" },
];

export default function InternationalAdmissions() {
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [degreeLevel, setDegreeLevel] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<InternationalCollege | null>(null);

  const filteredColleges = useMemo(() => {
    return INTERNATIONAL_COLLEGES.filter((c) => {
      const matchesCountry =
        selectedCountry === "All Countries" ||
        c.country.toLowerCase() === selectedCountry.toLowerCase();
      const matchesDegree =
        degreeLevel === "All" || c.degree_levels.includes(degreeLevel);
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.popular_majors.some((m) => m.toLowerCase().includes(search.toLowerCase()));
      return matchesCountry && matchesDegree && matchesSearch;
    });
  }, [selectedCountry, degreeLevel, search]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Globe2 className="h-3.5 w-3.5" />
              <span>Global Higher Education & Study Abroad Hub</span>
            </div>
            <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">
              International Admissions & Global Universities
            </h1>
            <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
              Explore QS top-ranked universities across the USA, UK, Canada, Germany, and Australia with standardized test cutoffs (SAT, GRE, IELTS) and post-study work permits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-3 py-2 text-xs font-medium text-[var(--color-ink-dim)]">
              {filteredColleges.length} Global Universities
            </span>
          </div>
        </div>

        {/* Global Country Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {COUNTRIES.map((ct) => (
            <button
              key={ct.name}
              onClick={() => setSelectedCountry(ct.name)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedCountry === ct.name
                  ? "bg-[var(--color-brand)] text-white shadow-sm ring-2 ring-[var(--color-brand)]/20"
                  : "border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)]/80 hover:text-[var(--color-ink)]"
              }`}
            >
              <span>{ct.flag}</span>
              <span>{ct.name}</span>
            </button>
          ))}
        </div>

        {/* Filters & Search Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search university, program (e.g. MIT, Computer Science, Munich)..."
              className="input pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value)}
              className="input w-auto text-xs font-medium"
            >
              <option value="All">All Degrees</option>
              <option value="Bachelors">Undergraduate (Bachelor's / BS)</option>
              <option value="Masters">Postgraduate (Master's / MS)</option>
              <option value="PhD">Doctoral (PhD)</option>
            </select>
          </div>
        </div>

        {/* Work Permit & Visa Highlight Banner */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-gradient-to-br from-blue-500/10 via-transparent to-transparent p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>🇺🇸</span> US STEM OPT (3 Years)
            </div>
            <p className="mt-1 text-xs text-[var(--color-ink-dim)]">
              F-1 visa students in STEM fields receive up to 36 months of full-time work authorization in the USA without H-1B sponsorship.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-gradient-to-br from-amber-500/10 via-transparent to-transparent p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>🇩🇪</span> Germany Free Tuition & Blue Card
            </div>
            <p className="mt-1 text-xs text-[var(--color-ink-dim)]">
              Public German universities charge almost €0 tuition fee. Graduates get an 18-month job search visa leading to an EU Blue Card.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>🇨🇦</span> Canada PGWP & PR Pathways
            </div>
            <p className="mt-1 text-xs text-[var(--color-ink-dim)]">
              Canadian degrees grant up to 3 years Post-Graduation Work Permit (PGWP) with high CRS points for Express Entry PR.
            </p>
          </div>
        </div>

        {/* University Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredColleges.map((college) => (
            <div
              key={college.id}
              onClick={() => setSelectedCollege(college)}
              className="card group relative flex flex-col justify-between p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{college.flag}</span>
                    <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      QS Rank #{college.qs_world_ranking}
                    </span>
                  </div>
                  <span className="rounded-md border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-ink-dim)]">
                    Acceptance: {college.acceptance_rate}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-[var(--color-ink)] group-hover:text-blue-600 transition-colors line-clamp-2">
                  {college.name}
                </h3>

                <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--color-ink-faint)]">
                  <MapPin className="h-3 w-3" /> {college.city}, {college.country}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
                    <span className="text-[var(--color-ink-faint)]">Annual Tuition</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      ${college.annual_tuition_usd.toLocaleString("en-US")}
                    </p>
                    <span className="text-[10px] text-[var(--color-ink-faint)]">
                      (~₹{college.annual_tuition_inr_lakhs} Lakhs/yr)
                    </span>
                  </div>

                  <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
                    <span className="text-[var(--color-ink-faint)]">English Test</span>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 truncate">
                      {college.required_tests.english_proficiency.split("/")[0]}
                    </p>
                    <span className="text-[10px] text-[var(--color-ink-faint)]">IELTS / TOEFL</span>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/50 p-2 text-[11px]">
                  <span className="font-semibold text-[var(--color-ink)]">Popular Majors:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {college.popular_majors.slice(0, 3).map((major) => (
                      <span
                        key={major}
                        className="rounded-md bg-[var(--color-bg)] px-1.5 py-0.5 text-[10px] text-[var(--color-ink-dim)] shadow-2xs"
                      >
                        {major}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--color-border-soft)]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span>View Requirements & Visa Details</span>
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College Details Modal */}
      {selectedCollege && (
        <InternationalCollegeModal
          college={selectedCollege}
          onClose={() => setSelectedCollege(null)}
        />
      )}
    </AppShell>
  );
}

function InternationalCollegeModal({
  college,
  onClose,
}: {
  college: InternationalCollege;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{college.flag}</span>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                QS World Ranking #{college.qs_world_ranking}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Acceptance: {college.acceptance_rate}
              </span>
            </div>
            <h2 className="mt-2 font-display text-xl md:text-2xl font-bold">{college.name}</h2>
            <p className="mt-0.5 text-xs text-[var(--color-ink-faint)]">
              {college.city}, {college.country}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
            <span className="text-[var(--color-ink-faint)]">Annual Tuition</span>
            <p className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">
              ${college.annual_tuition_usd.toLocaleString("en-US")}
            </p>
            <p className="text-[10px] text-[var(--color-ink-faint)]">
              ~₹{college.annual_tuition_inr_lakhs} Lakhs
            </p>
          </div>
          <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
            <span className="text-[var(--color-ink-faint)]">Application Fee</span>
            <p className="mt-0.5 font-bold">${college.application_fee_usd} USD</p>
          </div>
          <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
            <span className="text-[var(--color-ink-faint)]">Fall Deadline</span>
            <p className="mt-0.5 font-bold truncate">{college.deadlines.fall.split("/")[0]}</p>
          </div>
          <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
            <span className="text-[var(--color-ink-faint)]">Work Permit</span>
            <p className="mt-0.5 font-bold text-blue-500 truncate">
              {college.stem_opt_work_permit.split("(")[0]}
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-5 space-y-3">
          <h3 className="text-sm font-bold">Standardized Test Requirements</h3>
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/50 p-4 space-y-2 text-xs">
            {college.required_tests.undergraduate && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[var(--color-ink)] min-w-[120px]">Undergraduate:</span>
                <span className="text-[var(--color-ink-dim)]">{college.required_tests.undergraduate}</span>
              </div>
            )}
            {college.required_tests.postgraduate && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[var(--color-ink)] min-w-[120px]">Postgraduate / MS:</span>
                <span className="text-[var(--color-ink-dim)]">{college.required_tests.postgraduate}</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="font-semibold text-[var(--color-ink)] min-w-[120px]">English Proficiency:</span>
              <span className="text-[var(--color-ink-dim)]">{college.required_tests.english_proficiency}</span>
            </div>
          </div>
        </div>

        {/* Post-study Work Permit */}
        <div className="mt-4">
          <h3 className="text-sm font-bold">Post-Study Work Authorization & Visas</h3>
          <div className="mt-2 rounded-2xl bg-blue-500/10 p-3 text-xs text-blue-900 dark:text-blue-200">
            <p className="font-semibold">{college.stem_opt_work_permit}</p>
          </div>
        </div>

        {/* Scholarships */}
        <div className="mt-4">
          <h3 className="text-sm font-bold">Scholarships for International Students</h3>
          <div className="mt-2 rounded-2xl bg-emerald-500/10 p-3 text-xs text-emerald-900 dark:text-emerald-200">
            <p>{college.scholarships_available}</p>
          </div>
        </div>

        {/* Official Website Button */}
        <div className="mt-6 flex justify-end">
          <a
            href={college.website}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex items-center gap-2 text-xs"
          >
            Visit Official University Admissions Portal <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
