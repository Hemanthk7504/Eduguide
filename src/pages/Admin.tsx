import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Building2, GraduationCap, Compass, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { AppShell } from "../components/AppShell";
import {
  createBranch,
  createCollege,
  createCutoff,
  createScholarship,
  listColleges,
} from "../api/agents";
import { ingestFile, ingestText, listKbDocuments } from "../api/misc";

const TABS = [
  { key: "colleges", label: "Colleges & cutoffs", icon: Building2 },
  { key: "scholarships", label: "Scholarships", icon: GraduationCap },
  { key: "branches", label: "Branches", icon: Compass },
  { key: "kb", label: "Knowledge base", icon: UploadCloud },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function Admin() {
  const [tab, setTab] = useState<TabKey>("colleges");

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-semibold">Admin panel</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
          Manage the data that powers recommendations across the platform.
        </p>

        <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl bg-[var(--color-surface-2)] p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "colleges" && <CollegesTab />}
          {tab === "scholarships" && <ScholarshipsTab />}
          {tab === "branches" && <BranchesTab />}
          {tab === "kb" && <KnowledgeBaseTab />}
        </div>
      </div>
    </AppShell>
  );
}

function FormShell({
  title,
  onSubmit,
  children,
  success,
  submitLabel = "Save",
  submitting,
}: {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  success?: string | null;
  submitLabel?: string;
  submitting?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      {children}
      {success && (
        <p className="flex items-center gap-1.5 rounded-lg bg-[var(--color-agent-green)]/10 px-3 py-2 text-sm text-[var(--color-agent-green)]">
          <CheckCircle2 className="h-4 w-4" /> {success}
        </p>
      )}
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}

function LField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-dim)]">{label}</span>
      {children}
    </label>
  );
}

function CollegesTab() {
  const { data: colleges } = useQuery({ queryKey: ["admin-colleges"], queryFn: () => listColleges() });

  const [collegeForm, setCollegeForm] = useState({
    name: "",
    city: "",
    state: "",
    affiliation: "",
    naac_grade: "",
    fee_per_year: "",
    has_hostel: false,
    website: "",
  });
  const collegeMutation = useMutation({
    mutationFn: () =>
      createCollege({
        ...collegeForm,
        fee_per_year: collegeForm.fee_per_year ? Number(collegeForm.fee_per_year) : undefined,
        branches_offered: [],
      }),
  });

  const [cutoffForm, setCutoffForm] = useState({
    college_id: "",
    branch: "",
    category: "",
    closing_rank: "",
    opening_rank: "",
    year: new Date().getFullYear().toString(),
  });
  const cutoffMutation = useMutation({
    mutationFn: () =>
      createCutoff(cutoffForm.college_id, {
        branch: cutoffForm.branch,
        category: cutoffForm.category,
        closing_rank: Number(cutoffForm.closing_rank),
        opening_rank: cutoffForm.opening_rank ? Number(cutoffForm.opening_rank) : undefined,
        year: Number(cutoffForm.year),
      }),
  });

  return (
    <div className="space-y-6">
      <FormShell
        title="Add a college"
        submitting={collegeMutation.isPending}
        success={collegeMutation.isSuccess ? "College added." : null}
        onSubmit={(e) => {
          e.preventDefault();
          collegeMutation.mutate();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <LField label="Name">
            <input
              className="input"
              required
              value={collegeForm.name}
              onChange={(e) => setCollegeForm((f) => ({ ...f, name: e.target.value }))}
            />
          </LField>
          <LField label="Affiliation">
            <input
              className="input"
              value={collegeForm.affiliation}
              onChange={(e) => setCollegeForm((f) => ({ ...f, affiliation: e.target.value }))}
            />
          </LField>
          <LField label="City">
            <input
              className="input"
              required
              value={collegeForm.city}
              onChange={(e) => setCollegeForm((f) => ({ ...f, city: e.target.value }))}
            />
          </LField>
          <LField label="State">
            <input
              className="input"
              value={collegeForm.state}
              onChange={(e) => setCollegeForm((f) => ({ ...f, state: e.target.value }))}
            />
          </LField>
          <LField label="NAAC grade">
            <input
              className="input"
              value={collegeForm.naac_grade}
              onChange={(e) => setCollegeForm((f) => ({ ...f, naac_grade: e.target.value }))}
            />
          </LField>
          <LField label="Fee / year (₹)">
            <input
              type="number"
              className="input"
              value={collegeForm.fee_per_year}
              onChange={(e) => setCollegeForm((f) => ({ ...f, fee_per_year: e.target.value }))}
            />
          </LField>
          <LField label="Website">
            <input
              className="input"
              value={collegeForm.website}
              onChange={(e) => setCollegeForm((f) => ({ ...f, website: e.target.value }))}
            />
          </LField>
          <label className="flex items-center gap-2 pt-6 text-sm text-[var(--color-ink-dim)]">
            <input
              type="checkbox"
              checked={collegeForm.has_hostel}
              onChange={(e) => setCollegeForm((f) => ({ ...f, has_hostel: e.target.checked }))}
              className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-brand)]"
            />
            Has hostel
          </label>
        </div>
      </FormShell>

      <FormShell
        title="Add a cutoff record"
        submitting={cutoffMutation.isPending}
        success={cutoffMutation.isSuccess ? "Cutoff record added." : null}
        onSubmit={(e) => {
          e.preventDefault();
          cutoffMutation.mutate();
        }}
      >
        <LField label="College">
          <select
            className="input"
            required
            value={cutoffForm.college_id}
            onChange={(e) => setCutoffForm((f) => ({ ...f, college_id: e.target.value }))}
          >
            <option value="">Select a college</option>
            {colleges?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </LField>
        <div className="grid gap-4 sm:grid-cols-2">
          <LField label="Branch">
            <input
              className="input"
              required
              value={cutoffForm.branch}
              onChange={(e) => setCutoffForm((f) => ({ ...f, branch: e.target.value }))}
            />
          </LField>
          <LField label="Category">
            <input
              className="input"
              required
              value={cutoffForm.category}
              onChange={(e) => setCutoffForm((f) => ({ ...f, category: e.target.value }))}
            />
          </LField>
          <LField label="Closing rank">
            <input
              type="number"
              className="input"
              required
              value={cutoffForm.closing_rank}
              onChange={(e) => setCutoffForm((f) => ({ ...f, closing_rank: e.target.value }))}
            />
          </LField>
          <LField label="Opening rank">
            <input
              type="number"
              className="input"
              value={cutoffForm.opening_rank}
              onChange={(e) => setCutoffForm((f) => ({ ...f, opening_rank: e.target.value }))}
            />
          </LField>
          <LField label="Year">
            <input
              type="number"
              className="input"
              required
              value={cutoffForm.year}
              onChange={(e) => setCutoffForm((f) => ({ ...f, year: e.target.value }))}
            />
          </LField>
        </div>
      </FormShell>
    </div>
  );
}

function ScholarshipsTab() {
  const [form, setForm] = useState({
    name: "",
    provider_type: "govt",
    amount: "",
    coverage: "",
    deadline: "",
    application_link: "",
    eligibility: "",
  });
  const mutation = useMutation({
    mutationFn: () =>
      createScholarship({
        ...form,
        provider_type: form.provider_type as "govt" | "private",
        amount: form.amount ? Number(form.amount) : undefined,
      }),
  });

  return (
    <FormShell
      title="Add a scholarship"
      submitting={mutation.isPending}
      success={mutation.isSuccess ? "Scholarship added." : null}
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LField label="Name">
          <input
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </LField>
        <LField label="Provider type">
          <select
            className="input"
            value={form.provider_type}
            onChange={(e) => setForm((f) => ({ ...f, provider_type: e.target.value }))}
          >
            <option value="govt">Government</option>
            <option value="private">Private</option>
          </select>
        </LField>
        <LField label="Amount (₹)">
          <input
            type="number"
            className="input"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          />
        </LField>
        <LField label="Deadline">
          <input
            type="date"
            className="input"
            value={form.deadline}
            onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
          />
        </LField>
        <LField label="Coverage">
          <input
            className="input"
            value={form.coverage}
            onChange={(e) => setForm((f) => ({ ...f, coverage: e.target.value }))}
          />
        </LField>
        <LField label="Application link">
          <input
            className="input"
            value={form.application_link}
            onChange={(e) => setForm((f) => ({ ...f, application_link: e.target.value }))}
          />
        </LField>
      </div>
      <LField label="Eligibility">
        <textarea
          className="input"
          rows={3}
          value={form.eligibility}
          onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))}
        />
      </LField>
    </FormShell>
  );
}

function BranchesTab() {
  const [form, setForm] = useState({
    branch_name: "",
    description: "",
    market_demand_score: "",
    avg_starting_package: "",
    growth_trend: "stable",
    related_skills: "",
    higher_studies_options: "",
  });
  const mutation = useMutation({
    mutationFn: () =>
      createBranch({
        branch_name: form.branch_name,
        description: form.description,
        market_demand_score: Number(form.market_demand_score || 0),
        avg_starting_package: form.avg_starting_package ? Number(form.avg_starting_package) : undefined,
        growth_trend: form.growth_trend as any,
        related_skills: form.related_skills.split(",").map((s) => s.trim()).filter(Boolean),
        higher_studies_options: form.higher_studies_options.split(",").map((s) => s.trim()).filter(Boolean),
      }),
  });

  return (
    <FormShell
      title="Add a branch"
      submitting={mutation.isPending}
      success={mutation.isSuccess ? "Branch added." : null}
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <LField label="Branch name">
          <input
            className="input"
            required
            value={form.branch_name}
            onChange={(e) => setForm((f) => ({ ...f, branch_name: e.target.value }))}
          />
        </LField>
        <LField label="Growth trend">
          <select
            className="input"
            value={form.growth_trend}
            onChange={(e) => setForm((f) => ({ ...f, growth_trend: e.target.value }))}
          >
            <option value="rising">Rising</option>
            <option value="stable">Stable</option>
            <option value="declining">Declining</option>
          </select>
        </LField>
        <LField label="Market demand score (0-100)">
          <input
            type="number"
            className="input"
            value={form.market_demand_score}
            onChange={(e) => setForm((f) => ({ ...f, market_demand_score: e.target.value }))}
          />
        </LField>
        <LField label="Avg starting package (₹)">
          <input
            type="number"
            className="input"
            value={form.avg_starting_package}
            onChange={(e) => setForm((f) => ({ ...f, avg_starting_package: e.target.value }))}
          />
        </LField>
      </div>
      <LField label="Description">
        <textarea
          className="input"
          rows={2}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </LField>
      <div className="grid gap-4 sm:grid-cols-2">
        <LField label="Related skills (comma separated)">
          <input
            className="input"
            value={form.related_skills}
            onChange={(e) => setForm((f) => ({ ...f, related_skills: e.target.value }))}
          />
        </LField>
        <LField label="Higher studies options (comma separated)">
          <input
            className="input"
            value={form.higher_studies_options}
            onChange={(e) => setForm((f) => ({ ...f, higher_studies_options: e.target.value }))}
          />
        </LField>
      </div>
    </FormShell>
  );
}

function KnowledgeBaseTab() {
  const { data: docs } = useQuery({ queryKey: ["kb-documents"], queryFn: listKbDocuments });
  const [mode, setMode] = useState<"text" | "file">("text");
  const [meta, setMeta] = useState({ title: "", category: "", source: "" });
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      mode === "text"
        ? ingestText({ ...meta, text })
        : ingestFile({ ...meta, file: file as File }),
  });

  return (
    <div className="space-y-6">
      <FormShell
        title="Ingest into the knowledge base"
        submitting={mutation.isPending}
        submitLabel="Ingest"
        success={
          mutation.isSuccess
            ? `Ingested ${mutation.data?.chunks_ingested ?? 0} chunk(s).`
            : null
        }
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <div className="flex gap-1 rounded-lg bg-[var(--color-surface-2)] p-1">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
              mode === "text" ? "bg-[var(--color-brand)] text-white" : "text-[var(--color-ink-dim)]"
            }`}
          >
            Paste text
          </button>
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
              mode === "file" ? "bg-[var(--color-brand)] text-white" : "text-[var(--color-ink-dim)]"
            }`}
          >
            Upload file
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <LField label="Title">
            <input
              className="input"
              required
              value={meta.title}
              onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
            />
          </LField>
          <LField label="Category">
            <input
              className="input"
              required
              value={meta.category}
              onChange={(e) => setMeta((m) => ({ ...m, category: e.target.value }))}
            />
          </LField>
        </div>
        <LField label="Source (optional)">
          <input
            className="input"
            value={meta.source}
            onChange={(e) => setMeta((m) => ({ ...m, source: e.target.value }))}
          />
        </LField>

        {mode === "text" ? (
          <LField label="Content">
            <textarea
              className="input"
              rows={6}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </LField>
        ) : (
          <LField label="File">
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="input file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-brand)] file:px-3 file:py-1.5 file:text-white"
            />
          </LField>
        )}
      </FormShell>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold">Ingested documents</h3>
        {!docs?.length && <p className="text-sm text-[var(--color-ink-faint)]">No documents ingested yet.</p>}
        <div className="space-y-2">
          {docs?.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg bg-[var(--color-surface-2)] px-3 py-2 text-sm">
              <span className="truncate">{d.title}</span>
              <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">
                {d.category} · {d.chunks_ingested} chunks
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
