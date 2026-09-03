import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Loader2 } from "lucide-react";
import { createProfile, validateProfile } from "../api/profiles";
import { TagInput } from "../components/TagInput";
import { ThemeToggle } from "../components/ThemeToggle";
import type { StudentProfileCreate } from "../types/api";

const EXAM_TYPES = ["EAMCET", "JEE", "NEET", "ECET", "OTHER"];
const CATEGORIES = ["OC", "BC-A", "BC-B", "BC-C", "BC-D", "BC-E", "SC", "ST", "EWS"];

const STEPS = ["Academics", "Preferences", "Background"] as const;

const initialForm: StudentProfileCreate = {
  full_name: "",
  marks_percentage: undefined,
  entrance_rank: undefined,
  exam_type: "",
  category: "",
  gender: "",
  preferred_branch: "",
  budget_max: undefined,
  preferred_city: "",
  hostel_required: false,
  annual_income: undefined,
  interests: [],
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<StudentProfileCreate>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof StudentProfileCreate>(key: K, value: StudentProfileCreate[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const created = await createProfile(form);
      const validated = await validateProfile(created.id);
      const w = validated.normalized_data?.validation_warnings ?? [];
      if (w.length) {
        setWarnings(w);
        setSubmitting(false);
        // Give the student a moment to see warnings before continuing
        return;
      }
      navigate(`/dashboard/${created.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Couldn't save your profile. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-xl">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)]">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span className="font-display text-lg font-semibold">EduGuide AI</span>
        </div>

        <Stepper current={step} />

        <div className="card mt-6 p-6 md:p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold">Tell us about your academics</h2>
              <Row>
                <LabeledField label="Full name">
                  <input
                    className="input"
                    value={form.full_name}
                    onChange={(e) => update("full_name", e.target.value)}
                    placeholder="Your name"
                  />
                </LabeledField>
                <LabeledField label="Marks (%)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="input"
                    value={form.marks_percentage ?? ""}
                    onChange={(e) => update("marks_percentage", numOrUndefined(e.target.value))}
                    placeholder="e.g. 92.5"
                  />
                </LabeledField>
              </Row>
              <Row>
                <LabeledField label="Entrance rank">
                  <input
                    type="number"
                    min={1}
                    className="input"
                    value={form.entrance_rank ?? ""}
                    onChange={(e) => update("entrance_rank", numOrUndefined(e.target.value))}
                    placeholder="e.g. 4521"
                  />
                </LabeledField>
                <LabeledField label="Exam type">
                  <select
                    className="input"
                    value={form.exam_type}
                    onChange={(e) => update("exam_type", e.target.value)}
                  >
                    <option value="">Select exam</option>
                    {EXAM_TYPES.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </LabeledField>
              </Row>
              <LabeledField label="Reservation category">
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </LabeledField>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold">Your preferences</h2>
              <Row>
                <LabeledField label="Preferred branch">
                  <input
                    className="input"
                    value={form.preferred_branch}
                    onChange={(e) => update("preferred_branch", e.target.value)}
                    placeholder="e.g. Computer Science"
                  />
                </LabeledField>
                <LabeledField label="Preferred city">
                  <input
                    className="input"
                    value={form.preferred_city}
                    onChange={(e) => update("preferred_city", e.target.value)}
                    placeholder="e.g. Vijayawada"
                  />
                </LabeledField>
              </Row>
              <LabeledField label="Max annual fee budget (₹)">
                <input
                  type="number"
                  min={0}
                  className="input"
                  value={form.budget_max ?? ""}
                  onChange={(e) => update("budget_max", numOrUndefined(e.target.value))}
                  placeholder="e.g. 150000"
                />
              </LabeledField>
              <label className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3.5 py-3">
                <span className="text-sm font-medium text-[var(--color-ink-dim)]">Hostel required</span>
                <Toggle checked={form.hostel_required} onChange={(v) => update("hostel_required", v)} />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold">A little more background</h2>
              <Row>
                <LabeledField label="Gender">
                  <select className="input" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </LabeledField>
                <LabeledField label="Annual family income (₹)">
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={form.annual_income ?? ""}
                    onChange={(e) => update("annual_income", numOrUndefined(e.target.value))}
                    placeholder="e.g. 400000"
                  />
                </LabeledField>
              </Row>
              <LabeledField label="Interests">
                <TagInput
                  value={form.interests}
                  onChange={(tags) => update("interests", tags)}
                  placeholder="Type an interest and press Enter"
                />
              </LabeledField>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="mt-5 space-y-2 rounded-xl bg-[var(--color-agent-orange)]/10 p-4 ring-1 ring-inset ring-[var(--color-agent-orange)]/30">
              <p className="text-sm font-semibold text-[var(--color-agent-orange)]">
                A few things worth double-checking
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-[var(--color-ink-dim)]">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
              <button
                className="btn-primary mt-2"
                onClick={async () => {
                  const created = await createProfile(form).catch(() => null);
                  if (created) navigate(`/dashboard/${created.id}`);
                }}
              >
                Continue anyway
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-[var(--color-agent-red)]/10 px-3 py-2 text-sm text-[var(--color-agent-red)]">
              {error}
            </p>
          )}

          <div className="mt-7 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-0"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="btn-primary">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Build my plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function numOrUndefined(v: string): number | undefined {
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-center gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                i <= current
                  ? "bg-[var(--color-brand)] text-white"
                  : "bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]"
              }`}
            >
              {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span
              className={`hidden text-sm font-medium sm:inline ${
                i <= current ? "text-[var(--color-ink)]" : "text-[var(--color-ink-faint)]"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && <div className="h-px flex-1 bg-[var(--color-border)]" />}
        </div>
      ))}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-dim)]">{label}</span>
      {children}
    </label>
  );
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
