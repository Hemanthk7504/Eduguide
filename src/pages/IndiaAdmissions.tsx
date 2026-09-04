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
  "Delhi NCR",
];

const COUNSELING_PORTALS = [
  { name: "TG EAPCET (Telangana)", url: "https://eapcet.tsche.ac.in", badge: "Telangana State" },
  { name: "AP EAPCET (Andhra Pradesh)", url: "https://cets.apsche.ap.gov.in", badge: "Andhra Pradesh" },
  { name: "JoSAA (IITs / NITs / IIITs)", url: "https://josaa.nic.in", badge: "National" },
  { name: "CSAB (Special Round NITs)", url: "https://csab.nic.in", badge: "National" },
  { name: "KEA KCET (Karnataka)", url: "https://cetonline.karnataka.gov.in/kea", badge: "Karnataka" },
];

export default function IndiaAdmissions() {
  const [city, setCity] = useState("");
  const [stateFilter, setStateFilter] = useState("Telangana");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CollegeOut | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["colleges", city],
    queryFn: () => listColleges(city || undefined),
  });

  const states = useMemo(() => {
    const list = Array.from(new Set((data ?? []).map((c) => c.state).filter(Boolean))) as string[];
    POPULAR_STATES.forEach((s) => {
      if (!list.includes(s)) list.push(s);
    });
    return list.sort();
  }, [data]);

  const cities = useMemo(() => {
    const relevant = stateFilter
      ? (data ?? []).filter((c) => c.state?.toLowerCase() === stateFilter.toLowerCase())
      : data ?? [];
    const set = new Set(relevant.map((c) => c.city).filter(Boolean));
    return Array.from(set).sort();
  }, [data, stateFilter]);

  const filtered = (data ?? []).filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesState = stateFilter
      ? c.state?.toLowerCase() === stateFilter.toLowerCase()
      : true;
    const matchesCity = city ? c.city.toLowerCase() === city.toLowerCase() : true;
    return matchesSearch && matchesState && matchesCity;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header section with India Theme */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <span>🇮🇳</span>
              <span>Indian Higher Education & State Counselling</span>
            </div>
            <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">
              India Admissions & College Directory
            </h1>
            <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
              Explore accredited engineering colleges, university cutoff ranks (TG EAPCET, AP EAPCET, JEE), seat intake, and annual fees.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-3 py-2 text-xs font-medium text-[var(--color-ink-dim)]">
              {filtered.length} Institutions Found
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

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Indian colleges (e.g. JNTU, CBIT, Vasavi, IIT)..."
              className="input pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCity("");
              }}
              className="input w-auto text-xs font-medium"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {cities.length > 0 && (
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input w-auto text-xs font-medium"
              >
                <option value="">All Cities in {stateFilter || "India"}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* College Grid */}
        <div className="mt-4">
          {isLoading && <ListSkeleton />}
          {!isLoading && filtered.length === 0 && (
            <div className="card p-8 text-center">
              <Building2 className="mx-auto h-8 w-8 text-[var(--color-ink-faint)]" />
              <h3 className="mt-2 text-base font-semibold">No colleges matching filters</h3>
              <p className="mt-1 text-sm text-[var(--color-ink-faint)]">
                Try switching the state to Telangana or Andhra Pradesh, or clearing search keywords.
              </p>
              <button
                onClick={() => {
                  setStateFilter("");
                  setCity("");
                  setSearch("");
                }}
                className="btn-secondary mt-3 text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
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
                    <MapPin className="h-3 w-3" /> {c.city}, {c.state}
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
                        Avg Package: ₹{c.placement_stats.avg_package || 7.5} LPA
                      </span>
                      <span className="font-semibold text-emerald-500">
                        {c.placement_stats.placement_pct || 85}% Placed
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-border-soft)]">
                  <span className="text-[11px] font-medium text-[var(--color-brand)] flex items-center justify-between">
                    <span>View Category Cutoffs & Branches</span>
                    <Sparkles className="h-3 w-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && <IndiaCollegeDetailModal college={selected} onClose={() => setSelected(null)} />}
    </AppShell>
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
              {college.state} · {college.city}
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
