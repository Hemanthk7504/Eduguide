import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, ExternalLink, MapPin, Search, X } from "lucide-react";
import { getCollegeCutoffs, listColleges } from "../api/agents";
import { AppShell } from "../components/AppShell";
import { ListSkeleton } from "../components/Skeletons";
import type { CollegeOut } from "../types/api";

export default function Colleges() {
  const [city, setCity] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CollegeOut | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["colleges", city],
    queryFn: () => listColleges(city || undefined),
  });

  const states = useMemo(() => {
    const set = new Set((data ?? []).map((c) => c.state).filter(Boolean));
    return Array.from(set).sort();
  }, [data]);

  const cities = useMemo(() => {
    const relevant = stateFilter
      ? (data ?? []).filter((c) => c.state === stateFilter)
      : data ?? [];
    const set = new Set(relevant.map((c) => c.city));
    return Array.from(set).sort();
  }, [data, stateFilter]);

  const filtered = (data ?? []).filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesState = stateFilter ? c.state === stateFilter : true;
    const matchesCity = city ? c.city === city : true;
    return matchesSearch && matchesState && matchesCity;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-2xl font-semibold">College directory</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
          Browse colleges, engineering programs, and cutoffs across Telangana, Andhra Pradesh, and other states.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges by name…"
              className="input pl-9"
            />
          </div>
          {states.length > 0 && (
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCity("");
              }}
              className="input w-auto"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s!}>
                  {s}
                </option>
              ))}
            </select>
          )}
          <select value={city} onChange={(e) => setCity(e.target.value)} className="input w-auto">
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          {isLoading && <ListSkeleton />}
          {!isLoading && filtered.length === 0 && (
            <div className="card p-6 text-center text-sm text-[var(--color-ink-faint)]">
              No colleges match your search.
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="card p-4 text-left transition-colors hover:border-[var(--color-brand)]/40"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--color-agent-teal)]/15 text-[var(--color-agent-teal)]">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">{c.name}</h3>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-[var(--color-ink-faint)]">
                      <MapPin className="h-3 w-3" /> {c.city}, {c.state}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.branches_offered?.slice(0, 3).map((b) => (
                    <span
                      key={b}
                      className="badge bg-[var(--color-surface-2)] text-[var(--color-ink-faint)] ring-1 ring-inset ring-[var(--color-border)]"
                    >
                      {b}
                    </span>
                  ))}
                  {c.branches_offered?.length > 3 && (
                    <span className="badge text-[var(--color-ink-faint)]">
                      +{c.branches_offered.length - 3} more
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && <CollegeDetailModal college={selected} onClose={() => setSelected(null)} />}
    </AppShell>
  );
}

function CollegeDetailModal({ college, onClose }: { college: CollegeOut; onClose: () => void }) {
  const { data: cutoffs, isLoading } = useQuery({
    queryKey: ["cutoffs", college.id],
    queryFn: () => getCollegeCutoffs(college.id),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="card max-h-[85vh] w-full max-w-lg overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold">{college.name}</h2>
            <p className="mt-0.5 text-sm text-[var(--color-ink-faint)]">
              {college.city}, {college.state} · {college.affiliation}
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

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <InfoStat label="NAAC grade" value={college.naac_grade ?? "—"} />
          <InfoStat
            label="Fee / year"
            value={college.fee_per_year ? `₹${college.fee_per_year.toLocaleString("en-IN")}` : "—"}
          />
          <InfoStat label="Hostel" value={college.has_hostel ? "Available" : "Not available"} />
          <InfoStat
            label="Placement %"
            value={
              college.placement_stats?.placement_pct != null
                ? `${college.placement_stats.placement_pct}%`
                : "—"
            }
          />
        </div>

        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
          >
            Visit website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}

        <h3 className="mt-5 mb-2 text-sm font-semibold">Branch-wise cutoffs</h3>
        {isLoading && <ListSkeleton rows={2} />}
        {!isLoading && (!cutoffs || cutoffs.length === 0) && (
          <p className="text-sm text-[var(--color-ink-faint)]">No cutoff data available yet.</p>
        )}
        {cutoffs && cutoffs.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-[var(--color-border-soft)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]">
                <tr>
                  <th className="px-3 py-2 font-medium">Branch</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Closing</th>
                  <th className="px-3 py-2 font-medium">Year</th>
                </tr>
              </thead>
              <tbody>
                {cutoffs.map((row) => (
                  <tr key={row.id} className="border-t border-[var(--color-border-soft)]">
                    <td className="px-3 py-2">{row.branch}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2 font-mono">{row.closing_rank}</td>
                    <td className="px-3 py-2 font-mono">{row.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface-2)] px-3 py-2.5">
      <p className="text-[11px] text-[var(--color-ink-faint)]">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
