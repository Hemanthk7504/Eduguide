import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ExternalLink,
  MapPin,
  Search,
  X,
  Briefcase,
  Sparkles,
  Layers,
  LayoutGrid,
  Filter,
} from "lucide-react";
import { getCollegeCutoffs, listColleges } from "../api/agents";
import { AppShell } from "../components/AppShell";
import { ListSkeleton } from "../components/Skeletons";
import type { CollegeOut } from "../types/api";

const POPULAR_STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Delhi",
];

const COUNSELING_PORTALS = [
  { name: "TG EAPCET (Telangana)", url: "https://eapcet.tsche.ac.in", badge: "Telangana State" },
  { name: "AP EAPCET (Andhra Pradesh)", url: "https://cets.apsche.ap.gov.in", badge: "Andhra Pradesh" },
  { name: "JoSAA (IITs / NITs / IIITs)", url: "https://josaa.nic.in", badge: "National" },
  { name: "CSAB (Special Round NITs)", url: "https://csab.nic.in", badge: "National" },
  { name: "KEA KCET (Karnataka)", url: "https://cetonline.karnataka.gov.in/kea", badge: "Karnataka" },
];

export default function IndiaAdmissions() {
  const [stateFilter, setStateFilter] = useState("Telangana");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [search, setSearch] = useState("");
  const [groupByDistrict, setGroupByDistrict] = useState(true);
  const [selected, setSelected] = useState<CollegeOut | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["colleges"],
    queryFn: () => listColleges(),
  });

  const states = useMemo(() => {
    const list = Array.from(new Set((data ?? []).map((c) => c.state).filter(Boolean))) as string[];
    POPULAR_STATES.forEach((s) => {
      if (!list.includes(s)) list.push(s);
    });
    return list.sort();
  }, [data]);

  // Compute available districts for the selected state with college counts
  const districts = useMemo(() => {
    const relevant = stateFilter && stateFilter !== "All India"
      ? (data ?? []).filter((c) => c.state?.toLowerCase() === stateFilter.toLowerCase())
      : data ?? [];

    const counts: Record<string, number> = {};
    relevant.forEach((c) => {
      const d = c.district || c.city || "Other";
      counts[d] = (counts[d] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [data, stateFilter]);

  // Filter colleges based on search, state, and district
  const filtered = useMemo(() => {
    return (data ?? []).filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.district && c.district.toLowerCase().includes(search.toLowerCase())) ||
        (c.city && c.city.toLowerCase().includes(search.toLowerCase())) ||
        (c.branches_offered && c.branches_offered.some((b) => b.toLowerCase().includes(search.toLowerCase())));

      const matchesState =
        !stateFilter || stateFilter === "All India"
          ? true
          : c.state?.toLowerCase() === stateFilter.toLowerCase();

      const matchesDistrict =
        !selectedDistrict
          ? true
          : (c.district && c.district.toLowerCase() === selectedDistrict.toLowerCase()) ||
            (c.city && c.city.toLowerCase() === selectedDistrict.toLowerCase());

      return matchesSearch && matchesState && matchesDistrict;
    });
  }, [data, search, stateFilter, selectedDistrict]);

  // Group filtered colleges by district
  const groupedColleges = useMemo(() => {
    const groups: Record<string, CollegeOut[]> = {};
    filtered.forEach((c) => {
      const d = c.district || c.city || "Other District";
      if (!groups[d]) groups[d] = [];
      groups[d].push(c);
    });
    return groups;
  }, [filtered]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header section with India Theme */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <span>🇮🇳</span>
              <span>State & District Wise Higher Education Directory</span>
            </div>
            <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">
              India Admissions & College Directory
            </h1>
            <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
              Explore accredited engineering colleges organized district-by-district with cutoff ranks (TG EAPCET, AP EAPCET, KCET, JEE Main), seat intake, and annual fees.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-3 py-2 text-xs font-medium text-[var(--color-ink-dim)]">
              {filtered.length} Institutions in View
            </span>
          </div>
        </div>

        {/* State Counseling Portals Quick Access Banner */}
        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Official Admission & Counseling Portals
            </span>
            <span className="text-[11px] text-[var(--color-ink-faint)]">Updated for 2025-26 Session</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {COUNSELING_PORTALS.map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] hover:border-orange-500/50 hover:text-orange-600 transition-colors"
              >
                <span>{portal.name}</span>
                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>

        {/* State Selector Tabs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-dim)]">
              Select State
            </span>
            {selectedDistrict && (
              <button
                onClick={() => setSelectedDistrict("")}
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
              >
                Clear District Filter ({selectedDistrict})
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All India", ...states].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStateFilter(st);
                  setSelectedDistrict("");
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  stateFilter === st
                    ? "bg-orange-500 text-white shadow-xs ring-2 ring-orange-500/20"
                    : "border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)]/80 hover:text-[var(--color-ink)]"
                }`}
              >
                <span>{st === "All India" ? "🇮🇳" : "📍"}</span>
                <span>{st}</span>
              </button>
            ))}
          </div>
        </div>

        {/* District Selector Filter Pills */}
        {districts.length > 0 && (
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/50 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--color-ink-dim)] flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-orange-500" />
                <span>Districts in {stateFilter || "India"}</span>
              </span>
              <span className="text-[11px] text-[var(--color-ink-faint)]">
                Click a district to narrow down colleges
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedDistrict("")}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  !selectedDistrict
                    ? "bg-[var(--color-brand)] text-white shadow-2xs font-semibold"
                    : "border border-[var(--color-border-soft)] bg-[var(--color-bg)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                All Districts ({filtered.length})
              </button>

              {districts.map((d) => (
                <button
                  key={d.name}
                  onClick={() => setSelectedDistrict(selectedDistrict === d.name ? "" : d.name)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    selectedDistrict === d.name
                      ? "bg-orange-600 text-white shadow-2xs font-semibold ring-1 ring-orange-600/40"
                      : "border border-[var(--color-border-soft)] bg-[var(--color-bg)] text-[var(--color-ink-dim)] hover:border-orange-500/40 hover:text-[var(--color-ink)]"
                  }`}
                >
                  <span>{d.name}</span>
                  <span className="ml-1.5 opacity-70 text-[10px]">({d.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search & View Mode Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by college name, district, or branch (e.g. CBIT, Warangal, CSE)..."
              className="input pl-9"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] p-1 text-xs">
            <button
              onClick={() => setGroupByDistrict(true)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                groupByDistrict
                  ? "bg-[var(--color-bg-raised)] text-[var(--color-ink)] shadow-2xs font-semibold"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Group by District</span>
            </button>
            <button
              onClick={() => setGroupByDistrict(false)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                !groupByDistrict
                  ? "bg-[var(--color-bg-raised)] text-[var(--color-ink)] shadow-2xs font-semibold"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* College Directory View */}
        <div className="mt-4">
          {isLoading && <ListSkeleton />}

          {!isLoading && filtered.length === 0 && (
            <div className="card p-8 text-center">
              <Building2 className="mx-auto h-8 w-8 text-[var(--color-ink-faint)]" />
              <h3 className="mt-2 text-base font-semibold">No colleges matching your filters</h3>
              <p className="mt-1 text-sm text-[var(--color-ink-faint)]">
                Try switching the district or state, or clearing search keywords.
              </p>
              <button
                onClick={() => {
                  setStateFilter("Telangana");
                  setSelectedDistrict("");
                  setSearch("");
                }}
                className="btn-secondary mt-3 text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Grouped by District View */}
          {groupByDistrict && !isLoading && (
            <div className="space-y-8">
              {Object.entries(groupedColleges).map(([districtName, colleges]) => (
                <div key={districtName} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-md bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold text-xs">
                        📍
                      </span>
                      <h2 className="text-base font-bold text-[var(--color-ink)]">
                        {districtName} District
                      </h2>
                      <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-ink-dim)]">
                        {colleges.length} {colleges.length === 1 ? "College" : "Colleges"}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {colleges.map((c) => (
                      <CollegeCard key={c.id} college={c} onSelect={() => setSelected(c)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Flat Grid View */}
          {!groupByDistrict && !isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <CollegeCard key={c.id} college={c} onSelect={() => setSelected(c)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && <IndiaCollegeDetailModal college={selected} onClose={() => setSelected(null)} />}
    </AppShell>
  );
}

function CollegeCard({ college: c, onSelect }: { college: CollegeOut; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="card group relative flex flex-col justify-between p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-brand)]/50 hover:shadow-lg"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-agent-teal)]/15 text-[var(--color-agent-teal)] font-bold">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-ink-dim)]">
            {c.affiliation?.split("/")[0] || "Accredited"}
          </span>
        </div>

        <h3 className="mt-3 font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand)] transition-colors line-clamp-2">
          {c.name}
        </h3>

        <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--color-ink-faint)]">
          <MapPin className="h-3 w-3 text-orange-500" />
          <span className="font-medium text-[var(--color-ink-dim)]">{c.district || c.city}</span>, {c.state}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-lg bg-[var(--color-surface-2)] p-2">
            <span className="text-[var(--color-ink-faint)]">NAAC Grade</span>
            <p className="font-semibold text-[var(--color-ink)]">{c.naac_grade || "A"}</p>
          </div>
          <div className="rounded-lg bg-[var(--color-surface-2)] p-2">
            <span className="text-[var(--color-ink-faint)]">Tuition / Year</span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {c.fee_per_year ? `₹${(c.fee_per_year / 100000).toFixed(2)} Lakh` : "Govt / Subsidized"}
            </p>
          </div>
        </div>

        {c.placement_stats && (
          <div className="mt-2.5 flex items-center justify-between rounded-lg bg-[var(--color-surface-2)]/60 px-2.5 py-1.5 text-[11px] text-[var(--color-ink-dim)]">
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3 w-3 text-indigo-500" />
              Avg: ₹{c.placement_stats.avg_package || 7.5} LPA
            </span>
            <span className="font-semibold text-emerald-500">
              {c.placement_stats.placement_pct || 85}% Placed
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--color-border-soft)]">
        <span className="text-[11px] font-medium text-[var(--color-brand)] flex items-center justify-between">
          <span>View Category Cutoffs & Details</span>
          <Sparkles className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}

function IndiaCollegeDetailModal({ college, onClose }: { college: CollegeOut; onClose: () => void }) {
  const { data: cutoffs, isLoading } = useQuery({
    queryKey: ["cutoffs", college.id],
    queryFn: () => getCollegeCutoffs(college.id),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        className="card max-h-[90vh] w-full max-w-xl overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-medium text-orange-600 dark:text-orange-400">
              {college.district || college.city} District · {college.state}
            </span>
            <h2 className="mt-1 font-display text-xl font-bold">{college.name}</h2>
            <p className="mt-0.5 text-xs text-[var(--color-ink-faint)]">{college.affiliation}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
            <span className="text-[var(--color-ink-faint)]">NAAC Grade</span>
            <p className="mt-0.5 font-bold text-amber-500">{college.naac_grade ?? "A+"}</p>
          </div>
          <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
            <span className="text-[var(--color-ink-faint)]">Fee / Year</span>
            <p className="mt-0.5 font-bold text-emerald-500">
              {college.fee_per_year ? `₹${college.fee_per_year.toLocaleString("en-IN")}` : "Subsidized"}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
            <span className="text-[var(--color-ink-faint)]">Hostel Facility</span>
            <p className="mt-0.5 font-bold">{college.has_hostel ? "Available" : "No Hostel"}</p>
          </div>
          <div className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
            <span className="text-[var(--color-ink-faint)]">Placement Rate</span>
            <p className="mt-0.5 font-bold text-indigo-500">
              {college.placement_stats?.placement_pct ? `${college.placement_stats.placement_pct}%` : "85%+"}
            </p>
          </div>
        </div>

        {college.website && (
          <div className="mt-4">
            <a
              href={college.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand)] hover:underline"
            >
              Official College Website <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-bold tracking-tight">Closing Cutoff Ranks (Branch & Category)</h3>
          <p className="mt-0.5 text-xs text-[var(--color-ink-faint)]">
            Admission closing ranks from the latest counselling sessions.
          </p>

          {isLoading && <ListSkeleton rows={2} />}
          {!isLoading && (!cutoffs || cutoffs.length === 0) && (
            <p className="mt-3 text-xs text-[var(--color-ink-faint)]">No cutoff records recorded for this college yet.</p>
          )}

          {cutoffs && cutoffs.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-xl border border-[var(--color-border-soft)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Branch</th>
                    <th className="px-3 py-2 font-semibold">Category</th>
                    <th className="px-3 py-2 font-semibold">Closing Rank</th>
                    <th className="px-3 py-2 font-semibold">Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]">
                  {cutoffs.map((row) => (
                    <tr key={row.id} className="hover:bg-[var(--color-surface-2)]/40">
                      <td className="px-3 py-2 font-medium">{row.branch}</td>
                      <td className="px-3 py-2">
                        <span className="rounded-md bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[11px]">
                          {row.category}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono font-bold text-[var(--color-brand)]">
                        {row.closing_rank.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 font-mono text-[var(--color-ink-faint)]">{row.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
